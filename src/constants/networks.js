export const NetworkName = {
  localhost: 'localhost',
  mainnet: 'mainnet',
  rinkeby: 'rinkeby',
  kovan: 'kovan',
}


const infuraId = process.env.REACT_APP_INFURA_ID


export const NETWORKS = {
  1337: {
    name: NetworkName.localhost,
    color: '#666666',
    chainId: 1337,
    blockExplorer: '',
    rpcUrl: 'http://' + window.location.hostname + ':8545',
  },
  1: {
    name: NetworkName.mainnet,
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://etherscan.io/',
  },
  42: {
    name: NetworkName.kovan,
    color: '#7003DD',
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${infuraId}`,
    blockExplorer: 'https://kovan.etherscan.io/',
    faucet: 'https://gitter.im/kovan-testnet/faucet', // https://faucet.kovan.network/ // https://faucets.chain.link/
  },
  4: {
    name: NetworkName.rinkeby,
    color: '#e0d068',
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/', // https://faucets.chain.link/
  },
}

export const NETWORKS_BY_NAME = Object.values(NETWORKS).reduce((acc, curr) => {
  return {
    ...acc,
    [curr.name]: curr,
  };
}, {});

export const readNetwork = NETWORKS_BY_NAME[process.env.REACT_APP_INFURA_NETWORK]
