// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DDNS {
    struct DomainRecord {
        string domain;
        string ip;
        address owner;
        bool exists;
    }

    DomainRecord[] public domainRecords;
    mapping(string => uint) private domainIndex;

    function registerDomain(string calldata domain, string calldata ip) public {
        require(domainIndex[domain] == 0, "Domain already registered");

        domainRecords.push(DomainRecord(domain, ip, msg.sender, true));
        domainIndex[domain] = domainRecords.length; // store index+1
    }

    function resolve(string calldata domain) public view returns (string memory) {
        uint idx = domainIndex[domain];
        require(idx != 0 && domainRecords[idx-1].exists, "Domain not registered");
        return domainRecords[idx - 1].ip;
    }

    function updateDomain(string calldata domain, string calldata newIP) public {
        uint index = domainIndex[domain];
        require(index != 0 && domainRecords[index-1].exists , "Domain not registered");
        require(domainRecords[index - 1].owner == msg.sender, "message sender is not domain owner");

        domainRecords[index - 1].ip = newIP;
    }

    function getDomainInfo(string calldata domain) public view returns (DomainRecord memory) {
        uint index = domainIndex[domain];
        require(index != 0 && domainRecords[index-1].exists , "Domain not registered");

        return (domainRecords[index - 1]);
    }

    function getAllDomains() public view returns (DomainRecord[] memory) {
        return domainRecords;
    }
}
