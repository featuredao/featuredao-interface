import axios from 'axios';
import { isAddress } from '@ethersproject/address';
import _ from 'lodash';
import { Contract } from '@ethersproject/contracts';
import React, { useEffect, useContext, useState, useMemo } from 'react';
import { NetworkContext } from 'contexts/networkContext';
import { readProvider } from 'constants/readProvider';
import erc20Abi from 'erc-20-abi';

import { UserContext } from 'contexts/userContext';
import questionImg from 'assets/question.svg';
import Loading from 'components/shared/Loading';

const WethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const UsdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const UsdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
const NormalTokensAddress = [
  WethAddress,
  UsdcAddress,
  UsdtAddress,
]

const defaultTokenInfo = {
  decimals: 18,
  name: '',
  symbol: '',
  address: WethAddress,
  logoURI: questionImg,
  value: WethAddress,
  label: '',
  labelText: '',
}

function formatElem(elem) {
  const labelText = `${elem.symbol}${elem.name !== elem.symbol ? '(' + elem.name + ')' : ''}`;

  const tmpTokenInfo = {
    ...elem,

    searchInfo: `${labelText}_${elem.address}`.toLowerCase(),
    value: `${elem.address}`.toLowerCase(),
    address: `${elem.address}`.toLowerCase(),
    label: labelText,
  };
  return tmpTokenInfo;
}

export function useTokens() {
  const [promiseInfo, setPromiseInfo] = useState({});
  const { contracts } = useContext(UserContext);
  const [tokens, setTokens] = useState([]);
  const { signingProvider } = useContext(NetworkContext);

  useEffect(() => {
    axios
      .get(process.env.PUBLIC_URL + '/coinmarketcap-api-uniswap-all.json')
      .then((res) => {
        const tokensFormat = _.map(res.data.tokens, (elem) => {
          return formatElem(elem);
        });
        const newTokens = _.uniqBy([
          ...tokens,
          ...tokensFormat
        ], 'address');
        _.map(newTokens, (elem) => {
          newTokens[elem.address] = elem;
        });
        setTokens(newTokens);
      })
      .catch((rej) => {
        console.log('tokens all info rej', rej);
      });
  }, [
    // tokens,
  ]);

  function getTokens(address) {
    const formatAddress = `${address}`.toLowerCase();
    // console.log('getTokens', formatAddress);
    if (!isAddress(formatAddress)) {
      return Promise.reject('is not Address');
    }

    // return from cache
    if (tokens[`${formatAddress}`.toLowerCase()]) {
      return Promise.resolve(tokens[`${formatAddress}`.toLowerCase()]);
    }

    // one address just promise once is success.
    if (promiseInfo[formatAddress]) {
      return promiseInfo[formatAddress];
    }

    const signerOrProvider = signingProvider?.getSigner() ?? readProvider;

    const ERC20Contract = new Contract(formatAddress, erc20Abi, signerOrProvider);
    promiseInfo[formatAddress] = Promise.all([
      ERC20Contract.name(),
      ERC20Contract.symbol(),
      ERC20Contract.decimals(),
    ]).then((res) => {
      const newToken = formatElem({
        ...defaultTokenInfo,
        name: res[0],
        symbol: res[1],
        decimals: res[2],
        address: formatAddress,
        logoURI: questionImg,
        noShowLogoURI: true,
      });
      if (!tokens[formatAddress]) {
        tokens.push(newToken);
        tokens[formatAddress] = newToken;
        setTokens(tokens);
      }
    }).catch((rej) => {
      // console.log('rej', rej);
      delete promiseInfo[formatAddress];
      setPromiseInfo(promiseInfo);
      return Promise.reject(rej);
    });
    setPromiseInfo(promiseInfo);
    return promiseInfo[formatAddress];
  }

  const NormalTokens = useMemo(() => {
    if (!tokens?.length) {
      return [];
    }

    const arr = [];
    const addressArr = [...NormalTokensAddress];
    if (contracts?.FeatureToken?.address) {
      addressArr.push(contracts?.FeatureToken?.address);
    }
    _.map(addressArr, (elem) => {
      const token = tokens[`${elem}`.toLowerCase()];
      if (token?.address) {
        arr.push(token);
      }
      else {
        getTokens(elem);
      }
    });

    return arr;
  }, [
    // getTokens,
    contracts?.FeatureToken?.address,
    tokens,
    // tokens?.length,
  ]);

  function TokenInfo({
    address,
    render,
  }) {
    const token = tokens[`${address}`.toLowerCase()];
    if (!token) {
      getTokens(address);
      return (<Loading />);
    }
    return (<React.Fragment>
      {render(token)}
    </React.Fragment>)
  }

  return {
    NormalTokens,
    tokens,
    getTokens,
    TokenInfo,
  }
}
