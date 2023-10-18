// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/* Montly ePocket, you can claim on the established days of month */
contract ePocket is Ownable {
    
    //public for testing, move to internal
    uint[31] public establishedAmounts; // 31 slots for 31 days, each one storing the amount allowed 
                                        // to claim for that day of the month. For example to claim 
                                        // 0.5 eth on february 3, and 0.7 on february 8 this array will be
                                        // filled with 0 and on index 2 (index 0 of february 3) will have
                                        // a value of 0.5 on index 7 a value of 0.7. So 
                                        //      establishedAmounts[2] = parseEther('0.5');
                                        //      establishedAmounts[7] = parseEther('0.7');
                                        // This same array will be for every month, even if it has 30 or 28 days. 
                                        // Be careful when setting the amount on days 29, 30 or 31; since you 
                                        // won't be able to claim every month. For example you wont be able to 
                                        // claim for day 30 in february. 
    uint256 public lastClaim;  // timestamp of the last claim or 0 if there are no claims

    // used by getData, this struct is not used by the internal working, it is just to return an ordered pack of data 
    struct Data {   
        address owner;
        uint balance;
        uint[31] establishedAmounts;
        uint lastClaim;
    }

    event Received(uint amount, address from);         // received money, certain amount from a sender
    event Transfered(uint amount);                     // always transfer to the owner
    event ClaimCalled(string day);                     // owner claimed on the given day       
    event Withdrawed(uint amount, uint timestamp);      // owner withdrawed amount on the given timestamp

    // constructor should be set with an optional payable amount, and with establishedAmounts
    // and the owner will be the EOA who deployed this contract
    constructor(uint[31] memory _establishedAmounts) payable {
        establishedAmounts = _establishedAmounts;
    }
    
    // By declaring it, allows to receive money
    receive() external payable {
        emit Received(msg.value, msg.sender);
    }

    // return true if msg.sender is the owner
   function isOwner() internal view returns(bool) {
        return msg.sender == owner();
    }

    /* Transfer to the owner the specified amount */
    function wihdraw(uint amount) external onlyOwner {
        require(amount <= getBalance(), 'Not enough balance');
        
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Failed to send Ether"); 
        
        emit Withdrawed(amount, block.timestamp);
    }

    /* Transfer to the owner the established amount for today */
    function claim() external onlyOwner {
        require(allowedToClaim()>0, '0 allowed to claim');
        
        uint amount = establishedAmounts[getDay(block.timestamp) - 1];  // 0 indexed (change made on 13/10/2023)

        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Failed to send Ether"); 
        
        lastClaim = block.timestamp;
        emit Transfered(amount);
    }

    /* Only can claim once: the last unclaimed amount. Past unclaimend dates will be preserved for savings. 
     * Returns the amount to claim as a uint (to be parsed) */
    function allowedToClaim() public view returns(uint) {
        (, uint monthOfToday, uint dayOfToday) = timestampToDate(block.timestamp);                              
        (, uint monthOfLastClaim, uint dayOfLastClaim) = timestampToDate(lastClaim);

        require( !((monthOfToday == monthOfLastClaim) && (dayOfToday == dayOfLastClaim)),
                'Already claimed');

        // 0 indexed
        dayOfToday--;
        monthOfToday--;
        dayOfLastClaim--;
        monthOfLastClaim--;
        
        // restart if the month change
        bool restartFlag = false; 
        if(monthOfToday > monthOfLastClaim) {
            restartFlag = true;
        } 

        // cycle each day decreasing, returning to 30 if restartFlag
        for(uint i = dayOfToday; i != dayOfLastClaim; i--) {
            if(establishedAmounts[i] > 0) return establishedAmounts[i];

            if(restartFlag && i<=0) {
                i = 31;     // go back to day 31 (will be immediately decreased to 30, which is expected) 
            }
        
        }
        return 0;
    }

    // get balance of this contract (must be > 0 to withdraw/claim)
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    // sets establishedAmounts. Can be called anytime only by the owner
    function establishAmounts(uint[31] memory _establishedAmounts) public onlyOwner {
        establishedAmounts = _establishedAmounts;
    }

    // getter defined to prevent errors when changing the variable to internal (instead of public)
    function getEstablishedAmounts() public view returns(uint[31] memory) {
        return establishedAmounts;
    }   

    // returns a struct containing all the info of this contract, used to improve performance by returning all data in a sigle method call
    function getData() public view onlyOwner returns(Data memory) {
        return( Data( owner(), getBalance(), establishedAmounts, lastClaim ) );
    }

    // ------------------------------------------------------------------------
    // Calculate year/month/day from the number of days since 1970/01/01 using
    // the date conversion algorithm from
    // Thanks Github bokkypoobah/BokkyPooBahsDateTimeLibrary 
    // https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
    //
    // I asume date functions were already tested
    // ------------------------------------------------------------------------
    function _daysToDate(uint _days) public pure returns (uint year, uint month, uint day) {

        int OFFSET19700101 = 2440588;
        int __days = int(_days);

        int L = __days + 68569 + OFFSET19700101;
        int N = 4 * L / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = 4000 * (L + 1) / 1461001;
        L = L - 1461 * _year / 4 + 31;
        int _month = 80 * L / 2447;
        int _day = L - 2447 * _month / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint(_year);
        month = uint(_month);
        day = uint(_day);

    }
    
    function timestampToDate(uint timestamp) internal pure returns (uint year, uint month, uint day) {
        uint256 SECONDS_PER_DAY = 24 * 60 * 60;
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    // ------------------------------------------------------------------------    
    // Thanks Github bokkypoobah/BokkyPooBahsDateTimeLibrary 
    // https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
    //
    // I asume date functions were already tested
    // ------------------------------------------------------------------------
    function getDay(uint256 timestamp) public pure returns (uint256 day) {
            uint256 SECONDS_PER_DAY = 24 * 60 * 60;
            (,, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

    // ------------------------------------------------------------------------    
    // Thanks Github bokkypoobah/BokkyPooBahsDateTimeLibrary 
    // https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
    //
    // I asume date functions were already tested
    // ------------------------------------------------------------------------
    function getMonth(uint timestamp) internal pure returns (uint month) {
        uint256 SECONDS_PER_DAY = 24 * 60 * 60;
        (,month,) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

}