import { Avatar, List, Modal, Button, Form, Input } from 'antd';
import { t } from '@lingui/macro';
// Trans
import _ from 'lodash';
import VirtualList from 'rc-virtual-list';
import { isAddress } from '@ethersproject/address';
import { Contract } from '@ethersproject/contracts';
import erc20Abi from 'erc-20-abi';
import { BigNumber } from '@ethersproject/bignumber';
import useDebounceEffect from 'ahooks/lib/useDebounceEffect';
import { formatFixed, parseFixed } from "@ethersproject/bignumber";

// import { FormItems } from 'components/shared/formItems'
// import { BigNumber } from '@ethersproject/bignumber'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'
import { useCallback, useEffect, useContext, useState, useMemo } from 'react'
// import axios from 'axios';
import { NetworkContext } from 'contexts/networkContext';
import { TokensContext } from 'contexts/tokensContext';
import { readProvider } from 'constants/readProvider';
import ImageUploader from 'components/shared/inputs/ImageUploader';
import questionImg from 'assets/question.svg';

window.BigNumber = BigNumber;
const WethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

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

export default function ProjectDetailsAddForm({
  form,
  // hideProjectHandle = false,
  saveButton,
  style,
  loading,
  setModalVisible,
  onCancel,
  userAddress,
  contracts,
  isLeftSide,
  handleAdd,
  handleApprove,
  joinPairInfo,
  confirmLoading,
}) {
  window.joinPairInfo = joinPairInfo;
  window.form = form;
  const [allowance, setAllowance] = useState(BigNumber.from('0'));
  const [amount, setAmount] = useState(undefined);
  window.amount = amount;
  const [balance, setBalance] = useState(BigNumber.from('0'));
  window.allowance = allowance;
  window.balance = balance;
  const [tokenInfo, setTokenInfo] = useState({
    logoURI: questionImg,
    address: WethAddress,
    name: 'WETH',
  });
  window.tokenInfo = tokenInfo;

  const { signingProvider } = useContext(NetworkContext);
  const { tokens, getTokens, NormalTokens } = useContext(TokensContext);
  window.NormalTokens = NormalTokens;

  const [searchVal, changeSearchVal] = useState(undefined);
  const [tokensSearch, setTokensSearch] = useState([]);
  window.tokensSearch = tokensSearch;
  const [tokenChooseVisible, setTokenChooseVisible] = useState(false);
  const needApprove = useMemo(() => {
    if (!allowance) {
      // console.log('needApprove1');
      return true;
    }

    if (!tokenInfo?.address) {
      return false;
    }

    if (allowance?.toString() === '0') {
      // console.log('needApprove2');
      return true;
    }
    if (!amount) {
      // console.log('needApprove3');
      return false;
    }

    let amountFix = '0';
    try {
      amountFix = parseFixed(amount || 0, tokenInfo.decimals || 18);
    }
    catch (err) {
      console.log('err', err);
    }

    if (allowance.lt(BigNumber.from(amountFix))) {
      // console.log('needApprove4');
      return true;
    }
    // console.log('needApprove5');
    return false;
  }, [
    // here i dont want to watch amount.
    amount,
    tokenInfo?.decimals,
    tokenInfo?.address,
    allowance,
  ]);

  useDebounceEffect(() => {
    if (tokens && tokenInfo?.address) {
      const findToken = tokens[tokenInfo.address];
      if (findToken) {
        setTokenInfo(findToken);
      }
      else {
        setTokenInfo({});
      }
    }
  }, [
    tokens,
    tokenInfo?.address,
  ], {
    wait: 200,
  });

  const [getAllowanceTimeout, setGetAllowanceTimeout] = useState(false);

  useDebounceEffect(() => {
    if (getAllowanceTimeout) {
      clearInterval(getAllowanceTimeout);
    }

    const getAllowance = setInterval(() => {
      // console.log('contracts', contracts);
      if (!userAddress) {
        console.log('!userAddress');
        return setAllowance(BigNumber.from('0'));
      }
      if (!isAddress(tokenInfo?.address)) {
        console.log('not address');
        return setAllowance(BigNumber.from('0'));
      }
      if (!contracts?.FeatureRouter?.address) {
        console.log('not FeatureRouter');
        return setAllowance(BigNumber.from('0'));
      }

      const signerOrProvider = signingProvider?.getSigner() ?? readProvider;
      const ERC20Contract = new Contract(tokenInfo.address, erc20Abi, signerOrProvider);
      ERC20Contract.allowance(userAddress, contracts.FeatureRouter.address).then((res) => {
        // console.log('allowance res', res);
        return setAllowance(res);
      }).catch((rej) => {
        console.log('allowance rej', rej);
        return setAllowance(BigNumber.from('0'));
      });
    }, 1000);
    setGetAllowanceTimeout(getAllowance);
    return () => {
      clearInterval(getAllowanceTimeout);
    }
  }, [
    setGetAllowanceTimeout,
    signingProvider,
    signingProvider?.getSigner,
    amount,
    userAddress,
    tokenInfo?.address,
    contracts?.FeatureRouter?.address,
  ], {
    wait: 200,
  });

  useDebounceEffect(() => {
    // console.log('contracts', contracts);
    if (!userAddress) {
      console.log('!userAddress');
      return setAllowance(BigNumber.from('0'));
    }
    if (!isAddress(tokenInfo.address)) {
      console.log('not address');
      return setAllowance(BigNumber.from('0'));
    }

    const signerOrProvider = signingProvider?.getSigner() ?? readProvider;
    const ERC20Contract = new Contract(tokenInfo.address, erc20Abi, signerOrProvider);
    ERC20Contract.balanceOf(userAddress).then((res) => {
      console.log('balance res', res);
      return setBalance(res);
    }).catch((rej) => {
      console.log('balance rej', rej);
      return setBalance(BigNumber.from('0'));
    })
  }, [
    signingProvider,
    userAddress,
    tokenInfo.address,
  ], {
    wait: 200,
  });

  const handleTokenChange = useCallback((token) => {
    console.log('handleTokenChange token', token);
    setTokenInfo(token);
    setTokenChooseVisible(false);
  }, [

  ]);

  useDebounceEffect(() => {
    if (!tokenInfo?.address) {
      return;
    }
    form.setFieldsValue({
      token: tokenInfo.address,
      decimals: tokenInfo.decimals,
    });

  }, [
    tokenInfo?.decimals,
    tokenInfo?.address,
    form,
  ], {
    wait: 200,
  })

  useDebounceEffect(() => {
    const searchValStr = `${searchVal || ''}`.toLowerCase();
    if (searchValStr) {
      const filtersToken = _.filter(tokens, (elem) => {
        return elem.searchInfo.indexOf(searchValStr) > -1;
      });
      if (!filtersToken.length) {
        // 如果这里直接的弄那个
        // 那就将这个直接变成address返回
        if (isAddress(searchValStr)) {
          return new Promise(() => {
            getTokens?.(searchValStr).then((token) => {
              if (token) {
                setTokensSearch([token]);
              }
            }).catch((rej) => {
              console.log('rej', rej);
              setTokensSearch([]);
            });
          });
        }
        else {
          return setTokensSearch([]);
        }
      }
      else {
        return setTokensSearch(filtersToken);
      }
    }

    return setTokensSearch(tokens);
  }, [
    getTokens,
    signingProvider,
    tokens,
    tokens.length,
    searchVal,
  ], {
    wait: 200,
  });

  useEffect(() => {
    if (joinPairInfo?.token) {
      const token = _.find(tokens, (elem) => {
        return `${elem.address || ''}`.toLowerCase === `${joinPairInfo.token || ''}`.toLowerCase();
      });
      if (token && token.address) {
        setTokenInfo(token);
      }
      else {
        getTokens?.(joinPairInfo.token).then((token) => {
          setTokenInfo(token);
        }).catch((rej) => {
          return setTokenInfo({
            ...defaultTokenInfo,
            address: joinPairInfo.token,
            value: joinPairInfo.token,
          });
        });
      }
    }
  }, [
    tokens,
    getTokens,
    joinPairInfo,
  ]);

  const handleAmountChange = useCallback((e) => {
    const val = e.target.value;
    console.log('handleAmountChange', e, val);

    try {
      val && parseFixed(val || 0, tokenInfo?.decimals);
      setAmount(val);
      form.setFieldsValue({ amount: val });
    }
    catch (err) {
      console.log('err', err);
    }
  }, [
    form,
    tokenInfo?.decimals,
    setAmount,
  ]);

  useEffect(() => {
    if (joinPairInfo?.amount && tokenInfo?.decimals) {
      handleAmountChange({
        target: {
          value: formatFixed(joinPairInfo.amount, tokenInfo.decimals || 18),
        }
      });
    }
  }, [
    tokenInfo,
    joinPairInfo,
    handleAmountChange,
  ]);

  const handleMaxAmount = () => {
    console.log('handleMaxAmount');
    handleAmountChange({
      target: {
        value: formatFixed(balance.toString(), tokenInfo.decimals),
      }
    });
  }

  return (<div>
    <div>
      <span style={{ color: 'red' }}>Very Important: </span>
      <br />make sure you abort or withdraw token when project announceed. <br />Because everyone can withdraw all money from project when 365 days after project announceed. <br />If you agree this and you can add/join the project</div>
    <br />
    <br />
    <Form form={form} layout="vertical" style={style}>
      <Form.Item
        label="Token">
        <div className="" style={{ display: 'flex' }}>
          <div style={{ width: '100%', position: 'relative' }}>
            <Input
              disabled={joinPairInfo?.amount}
              className=""
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder="0.0"
              minLength="1"
              maxLength="79"
              spellCheck="false"
              value={amount}
              onChange={handleAmountChange}
              style={{ heigth: 38 }} />
            <span
              onClick={handleMaxAmount}
              style={{
                display: joinPairInfo?.token ? 'none' : '',
                position: 'absolute',
                right: '1em',
                lineHeight: '32px',
                cursor: 'pointer',
              }}
            >Max</span>
          </div>
          <div style={{ width: 160, height: 32 }}>
            <div
              onClick={() => {
                if (joinPairInfo?.token) {
                  // do nothing
                }
                else {
                  setTokenChooseVisible(true);
                }
              }}
              style={{
                height: 32,
                margin: '0',
                lineHeight: '30px',
                display: 'flex',
                verticalAlign: 'middle',
                textAlign: 'center',
                color: 'var(--text-primary)',
                border: '1px solid',
                borderColor: 'var(--stroke-secondary)',
                justifyContent: 'space-between',
                WebkitBoxAlign: 'center',
                alignItems: 'center',
                WebkitBoxPack: 'justify',
                borderLeft: 0,
                borderRadius: 0,
                paddingLeft: '.5em',
                paddingRight: '.5em',
                cursor: 'pointer',
              }}>
              <img
                className=""
                alt={`${tokenInfo.symbol} logo`}
                src={tokenInfo.logoURI}
                style={{ width: 24, height: 24, marginRight: '0.5rem' }} />
              <span
                style={{
                  whiteSpace: 'nowrap',
                  marginRight: '0.5rem',
                  minWidth: 40,
                  maxWidth: 60,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >{tokenInfo.symbol}</span>
              <span style={{
                width: 12,
                display: joinPairInfo?.token ? 'none' : '',
              }}>
                <svg
                  width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Form.Item>

      <Form.Item
        name="memo"
        label={t`Add/Join Memo`}
      >
        <Input
          autoComplete="off"
          placeholder={t`(Optional) I'm in.`}
        />
      </Form.Item>

      <Form.Item
        name="memoUri"
      >
        <ImageUploader
          text={t`Add image`}
          initialUrl={form.getFieldValue('memoUri')}
          onSuccess={memoUri => {
            const prevUrl = form.getFieldValue('memoUri')
            // Unpin previous file
            form.setFieldsValue({ memoUri })
            if (prevUrl) unpinIpfsFileByCid(cidFromUrl(prevUrl))
          }}
          metadata={{ from: 'web_pair' }}
          maxSize={1000000}
        />
      </Form.Item>
      <Form.Item name="token" style={{ display: 'none'}}>
        <input type="hidden" />
      </Form.Item>
      <Form.Item name="decimals" style={{ display: 'none' }}>
        <input type="hidden" />
      </Form.Item>
      <Form.Item name="amount" style={{ display: 'none' }}>
        <input type="hidden" />
      </Form.Item>
      <div
        style={{
          display: 'flex',
          textAlign: 'right',
          verticalAlign: 'center',
          justifyContent: 'flex-end',
        }}>
        <Button
          onClick={() => {
            setModalVisible(false);
            onCancel();
          }}
          style={{ marginRight: 10 }}
        >
          {t`Cancel`}
        </Button>
        <Button
          loading={confirmLoading}
          onClick={() => {
            if (needApprove) {
              return handleApprove();
            }
            else {
              return handleAdd();
            }
          }}
          type="primary"
        >
          {
            !userAddress ?
              t`Connect wallet`
              : (needApprove ? t`Approve` : (isLeftSide ? t`LeftSide` : t`RightSide`))

          }
        </Button>
        {/* <span onClick={() => { handleApprove(true)}}>reset</span> */}
      </div>
    </Form>
    <Modal
      visible={tokenChooseVisible}
      footer={null}
      width={450}
      title={t`Choose Token`}
      onCancel={() => setTokenChooseVisible(false)}
    >
      <div style={{ marginTop: -30 }}>
        <Input onChange={(e) => {
          const value = e.target.value;
          changeSearchVal(value);
        }} val={searchVal} />
        <div>
          {
            NormalTokens.map((elem) => {
              return (<Button style={{ marginTop: '1em', marginRight: '1em' }} key={elem.address} onClick={handleTokenChange.bind(this, elem)}>{elem.symbol}</Button>);
            })
          }
        </div>
        <List>
          <VirtualList
            key="VirtualList"
            height={350}
            itemHeight={47}
            itemKey="value"
            data={tokensSearch}>
            {
              (elem) => {
                return <List.Item key={elem.value}
                  token={elem}
                  onClick={handleTokenChange.bind(this, elem)}
                  style={{ cursor: 'pointer' }}
                >
                  <List.Item.Meta
                    key={elem.value}
                    title={elem.symbol}
                    description={elem.name}
                    avatar={<Avatar src={elem.logoURI} />}
                  />
                </List.Item>
              }
            }
          </VirtualList>
        </List>
      </div>
    </Modal>
  </div>);
}
