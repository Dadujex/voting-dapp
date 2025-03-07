// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Topic {
        string name;                  
        string[] options;           
        mapping(string => uint256) votes; 
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Topic) public topics;
    uint256 public topicCount;    

    event TopicCreated(uint256 indexed topicId, string name, string[] options);
    event VoteCast(uint256 indexed topicId, address indexed voter, string option, uint256 newVoteCount);

    function createTopic(string memory _name, string[] memory _options) public {
        require(_options.length > 0, "Options cannot be empty");
        Topic storage newTopic = topics[topicCount];
        newTopic.name = _name;
        newTopic.options = _options;
        emit TopicCreated(topicCount, _name, _options);
        topicCount++;
    }

    function vote(uint256 _topicId, string memory _option) public {
        require(_topicId < topicCount, "Invalid topic ID");
        Topic storage topic = topics[_topicId];
        require(!topic.hasVoted[msg.sender], "Already voted in this topic");
        require(isValidOption(_topicId, _option), "Invalid option");
        topic.votes[_option]++;
        topic.hasVoted[msg.sender] = true;
        emit VoteCast(_topicId, msg.sender, _option, topic.votes[_option]);
    }

    function isValidOption(uint256 _topicId, string memory _option) public view returns (bool) {
        Topic storage topic = topics[_topicId];
        for (uint i = 0; i < topic.options.length; i++) {
            if (keccak256(abi.encodePacked(topic.options[i])) == keccak256(abi.encodePacked(_option))) {
                return true;
            }
        }
        return false;
    }

    function getVotes(uint256 _topicId, string memory _option) public view returns (uint256) {
        require(_topicId < topicCount, "Invalid topic ID");
        require(isValidOption(_topicId, _option), "Invalid option");
        return topics[_topicId].votes[_option];
    }

    function getTopicOptions(uint256 _topicId) public view returns (string[] memory) {
        require(_topicId < topicCount, "Invalid topic ID");
        return topics[_topicId].options;
    }

    function getTopicName(uint256 _topicId) public view returns (string memory) {
        require(_topicId < topicCount, "Invalid topic ID");
        return topics[_topicId].name;
    }
}