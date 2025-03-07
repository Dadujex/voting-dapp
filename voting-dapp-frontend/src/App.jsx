import { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingABI from './VotingABI.json';
import { CONTRACT_ADDRESS } from './config';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicOptions, setNewTopicOptions] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [votes, setVotes] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        if (!window.ethereum) {
          setError('MetaMask is not installed!');
          return;
        }
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        const contractInstance = new web3Instance.eth.Contract(VotingABI, CONTRACT_ADDRESS);
        setContract(contractInstance);

        const topicCount = await contractInstance.methods.topicCount().call();
        const loadedTopics = [];
        const initialVotes = {};
        for (let i = 0; i < topicCount; i++) {
          const name = await contractInstance.methods.getTopicName(i).call();
          const options = await contractInstance.methods.getTopicOptions(i).call();
          loadedTopics.push({ id: Number(i), name, options });

          const topicVotes = {};
          for (const option of options) {
            const voteCount = await contractInstance.methods.getVotes(i, option).call();
            topicVotes[option] = voteCount;
          }
          initialVotes[i] = topicVotes;
        }
        setTopics(loadedTopics);
        setVotes(initialVotes);
      } catch (err) {
        setError('Failed to initialize: ' + err.message);
      }
    }
    init();
  }, []);

  useEffect(() => {
    setError(null);
  }, [newTopicName, newTopicOptions, selectedTopicId, selectedOption]);

  
  useEffect(() => {
    if (!contract || !contract.events) return;

    if (!contract.events.VoteCast || !contract.events.TopicCreated) {
      setError('Required events are not defined in the contract ABI.');
      return;
    }

    contract.events.VoteCast({ fromBlock: 'latest' })
      .on('data', (event) => {
        const { topicId, option, newVoteCount } = event.returnValues;
        setVotes((prev) => ({
          ...prev,
          [topicId]: { ...prev[topicId], [option]: newVoteCount },
        }));
      })

    contract.events
      .TopicCreated({ fromBlock: 'latest' })
      .on('data', (event) => {
        const { topicId, name, options } = event.returnValues;
        setTopics((prev) => {
          const topicIdNum = Number(topicId);
          if (prev.some((t) => t.id === topicIdNum)) return prev;
          return [...prev, { id: topicIdNum, name, options }];
        });
      })
  }, [contract]);

  const handleCreateTopic = async () => {
    setError(null);
    if (contract && newTopicName && newTopicOptions) {
      try {
        const optionsArray = newTopicOptions.split(',').map((opt) => opt.trim());
        await contract.methods.createTopic(newTopicName, optionsArray).send({ from: accounts[0] });
        setNewTopicName('');
        setNewTopicOptions('');
        alert('Topic created!');
      } catch (err) {
        setError('Failed to create topic: ' + err.message);
      }
    }
  };

  const handleVote = async () => {
    setError(null);
    if (contract && selectedTopicId !== null && selectedOption) {
      try {
        await contract.methods.vote(selectedTopicId, selectedOption).send({ from: accounts[0] });
        alert('Vote submitted!');
      } catch (err) {
        setError('Voting failed: ' + err.message);
      }
    }
  };

  const loadTopicVotes = async (topicId) => {
    if (contract) {
      const topicVotes = {};
      const options = topics.find((t) => t.id === topicId)?.options || [];
      for (const option of options) {
        const voteCount = await contract.methods.getVotes(topicId, option).call();
        topicVotes[option] = voteCount;
      }
      setVotes((prev) => ({ ...prev, [topicId]: topicVotes }));
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Voting dApp</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Create New Topic</h2>
        <input
          type="text"
          placeholder="Topic name"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Options (comma-separated)"
          value={newTopicOptions}
          onChange={(e) => setNewTopicOptions(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreateTopic}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Topic
        </button>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Topics</h2>
        {topics.map((topic) => (
          <div key={topic.id} className="mb-4 p-4 bg-white rounded shadow">
            <h3 className="text-lg font-bold">{topic.name}</h3>
            <select
              onChange={(e) => {
                setSelectedTopicId(topic.id);
                setSelectedOption(e.target.value);
                loadTopicVotes(topic.id);
              }}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select an option</option>
              {topic.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              onClick={handleVote}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Vote
            </button>
            <div className="mt-2">
              <h4 className="font-semibold">Results:</h4>
              {topic.options.map((option) => (
                <p key={option}>
                  {option}: {votes[topic.id]?.[option] || 0} votes
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;