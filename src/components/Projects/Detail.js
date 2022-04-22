import moment from 'moment';
import _ from 'lodash';
// import { InfoCircleOutlined } from '@ant-design/icons';
import { t } from '@lingui/macro';

import { Image, Button, Modal, Tooltip } from 'antd';
import React, { useContext, useCallback, useEffect, useState } from 'react';
// useCallback, createContext, useMemo
import Loading from 'components/shared/Loading';
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from '@ethersproject/contracts';
// import { getContractBuildInfo } from 'hooks/ContractLoader';
import { parseFixed } from "@ethersproject/bignumber";
// formatFixed

import ProjectDetailInfo from 'components/shared/ProjectDetailInfo';
import { TokensContext } from 'contexts/tokensContext';
import { ThemeContext } from 'contexts/themeContext';

import { useParams } from 'react-router-dom';
import erc20Abi from 'erc-20-abi';
import FormattedAddress from 'components/shared/FormattedAddress';

// import { Link } from 'react-router-dom';
import { UserContext } from 'contexts/userContext';
// import { readNetwork } from 'constants/networks';
// import EtherscanLink from 'components/shared/EtherscanLink';
import AddForm from './AddForm';

import { layouts } from 'constants/styles/layouts';
import { NetworkContext } from 'contexts/networkContext';

import { readProvider } from 'constants/readProvider';
import { formatProjectFromBigData } from './index';
import { loadContract } from 'hooks/ContractLoader';
import { FeatureProjectPublicNameType, FeatureProjectStatus } from 'models/contracts';
import { useForm } from 'antd/lib/form/Form';
import Amount from 'components/shared/currency/Amount';
// const contractBuildInfo = getContractBuildInfo();
function toLowerCase(str) {
  return `${str || ''}`.toLowerCase();
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const defaultPairInfo = {
  success: [],
  wait: [],
  abort: [],
  withdraw: [],
};


const renderTd = ({
  account,
  tokenAddress,
  amount,
  memo,
  memoUri,
  status,
  canAbort,
  canJoin,
  canWithdraw,
  handleAbort,
  handleJoinModel,
  handleWithdraw,
  TokenInfo,
  colors,
  transcatorLoading,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {
            !!account && !!TokenInfo && <TokenInfo
              address={tokenAddress}
              render={(token) => {
                return (<span>
                  <Tooltip title={token.symbol}>
                    <Amount amount={amount} decimals={token.decimals} precision={4} padEnd currency={token.symbol} />
                  </Tooltip>
                  {
                    !token.noShowLogoURI && <Tooltip title={token.symbol}>
                      <img style={{ width: 24, height: 24, marginRight: '0.5rem' }} src={token.logoURI} alt={token.symbol} />
                    </Tooltip>
                  }
                </span>
                );
              }}
            />
          }
        </div>
        <div>
          <div style={{
            color: colors.text.tertiary,
            lineHeight: '1.4em',
            fontSize: '0.7em',
          }}>
            { account && <FormattedAddress address={account} />}
            { !account && (canAbort || canJoin) && <span>Waiting to Join</span> }
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {!!memo && <div style={{
            color: colors.text.tertiary,
          }}>{memo}</div>}
          {
            !!memoUri && <div>
              <Image style={{
                maxWidth: 80,
                maxHeight: 80,
              }} src={memoUri} alt=" " />
            </div>
          }
        </div>
        <div>
          {canAbort && <Button loading={transcatorLoading} size="small" onClick={handleAbort}>Abort</Button>}
          {canWithdraw && <Button loading={transcatorLoading} size="small" onClick={handleWithdraw}>Withdraw</Button>}
          {canJoin && <Button loading={transcatorLoading} size="small" onClick={handleJoinModel}>Join</Button>}
        </div>
      </div>
    </div>
  );
}

const renderPairList = ({
  pairArr,
  desc,
  userAddress,
  handleWithdraw,
  handleAbort,
  handleJoinModel,
  TokenInfo,
  colors,
  project,
  transcatorLoading,
}) => {
  if (!pairArr?.length)  {
    return null;
  }
  return <React.Fragment>
    <tr className="project-detail-table-of-pair-typeHeader">
      <td colSpan={2}>
        {desc}
      </td>
    </tr>
    {
      _.map(pairArr, (elem) => {
        return (<tr key={`tr-${elem.index}`}>
          <td data-index={elem.index} data-mode="leftSide">
            {
              renderTd({
                transcatorLoading,
                colors,
                TokenInfo,
                handleWithdraw,
                handleAbort,
                handleJoinModel,
                account: elem.leftSide,
                tokenAddress: elem.token,
                amount: elem.amount,
                memo: elem.memoLeftSide,
                memoUri: elem.memoUriLeftSide,
                status: elem.status,
                canAbort: elem.status === FeatureProjectStatus.default && !elem.rightSide &&
                  toLowerCase(elem.leftSide) === toLowerCase(userAddress),
                canJoin: elem.status === FeatureProjectStatus.default && !elem.leftSide && !project.isAnnounced && !project.judgmentStartTime,
                canWithdraw: project.isAnnounced && FeatureProjectStatus.default === elem.status && elem.leftSide && elem.rightSide && project.isLeftSideWin,
              })
            }
            <span
              className="project-detail-table-of-pair-td-id"
              style={{
                color: colors.text.tertiary,
              }}
            >#{elem.index}</span>
          </td>
          <td data-index={elem.index} data-mode="rightSide">
            {
              renderTd({
                transcatorLoading,
                colors,
                TokenInfo,
                handleWithdraw,
                handleAbort,
                handleJoinModel,
                account: elem.rightSide,
                tokenAddress: elem.token,
                amount: elem.amount,
                memo: elem.memoRightSide,
                memoUri: elem.memoUriRightSide,
                status: elem.status,
                canAbort: elem.status === FeatureProjectStatus.default && !elem.leftSide &&
                  toLowerCase(elem.rightSide) === toLowerCase(userAddress),
                canJoin: elem.status === FeatureProjectStatus.default && !elem.rightSide && !project.isAnnounced && !project.judgmentStartTime,
                canWithdraw: project.isAnnounced && FeatureProjectStatus.default === elem.status && elem.leftSide && elem.rightSide && !project.isLeftSideWin,
              })
            }
          </td>
        </tr>);
      })
    }
  </React.Fragment>
}

export default function ProjectDetail() {
  const [addForm] = useForm();
  window.addForm = addForm;
  const { signingProvider, userAddress } = useContext(NetworkContext);
  // signerNetwork
  const { transactor, contracts } = useContext(UserContext);
  const [rerenderPair, setRerenderPair] = useState(false);

  const { projId } = useParams();
  const [pairs, setPairs] = useState(_.cloneDeep(defaultPairInfo));
  window.pairs = pairs;

  const { colors } = useContext(ThemeContext).theme;

  const { TokenInfo } = useContext(TokensContext);
  const [joinPairInfo, setJoinPairInfo] = useState(false);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [pairModalKey, setPairModalKey] = useState(false);
  const [judgementModalVisible, setJudgementModalVisible] = useState(false);
  const [unsetFeeRateModalVisible, setUnsetFeeRateModalVisible] = useState(false);
  const [isLeftSide, setIsLeftSide] = useState(false);
  const [infoLoading, setInfoLoading] = useState(true);
  const [pairLoading, setPairLoading] = useState(true);

  const [transcatorLoading, setTransactorLoading] = useState(false);

  const [project, setProject] = useState({
    projId: '0',
    project: '0',
    lockTime: '0',
    feeRate: '0',
    projInfo: [
      '',
      '',
      '',
    ],
    judgerInfo: [
      '',
      '',
      '',
    ],
  });
  window.project = project;
  const [contract, setContract] = useState();
  window.contract = contract;

  useEffect(() => {
    if (projId * 1 && contracts?.FeatureProjectInfo?.getProjectsByIndex) {
      contracts.FeatureProjectInfo?.getProjectsByIndex?.(projId * 1 - 1).then((res) => {
        const data = formatProjectFromBigData(res);
        setProject(data);
      }).catch((err) => {
        setInfoLoading(false);
      })
    }
  }, [
    contracts?.FeatureProjectInfo,
    projId,
    contracts?.FeatureProjectInfo?.getProjectsByIndex,
  ]);

  useEffect(() => {
    const signerOrProvider = signingProvider?.getSigner() ?? readProvider;
    if (project?.project && signerOrProvider) {
      const thisContract = loadContract('FeatureProject', signerOrProvider, project.project);
      setContract(thisContract);
    }
  }, [
    rerenderPair,
    project.project,
    signingProvider,
  ]);

  useEffect(() => {
    if (contract?.isLeftSideWin && project?.project) {
      const projectOtherInfo = {};
      return Promise.all([
        contract.isLeftSideWin().then((res) => {
          projectOtherInfo.isLeftSideWin = res;
        }),
        contract.feeRate().then((res) => {
          projectOtherInfo.feeRate = res.toString();
        }),
        contract.judgeFeeRateZeroPending().then((res) => {
          projectOtherInfo.judgeFeeRateZeroPending = res;
        }),
        contract.isAnnounced().then((res) => {
          projectOtherInfo.isAnnounced = res;
        }),
        contract.judgmentPending().then((res) => {
          projectOtherInfo.judgmentPending = res;
        }),
        contract.judgmentStartTime().then((res) => {
          projectOtherInfo.judgmentStartTime = res.toString() * 1;
        }),
      ]).then(() => {
        setProject({
          ...project,
          ...projectOtherInfo,
        });
        setInfoLoading(false);
      });
    }
  }, [
    rerenderPair,
    // project,
    project?.project,
    contract,
    contract?.isLeftSideWin,
  ]);

  useEffect(() => {
    if (contract?.getAllAddressData && contract?.getAllUintData && contract?.getAllStringData) {
      const pairsInfoArr = {};
      return Promise.all([
        contract.getAllAddressData(FeatureProjectPublicNameType.leftSide).then((res) => {
          pairsInfoArr.leftSide = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.leftSide rej', rej);
        }),
        contract.getAllAddressData(FeatureProjectPublicNameType.rightSide).then((res) => {
          pairsInfoArr.rightSide = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.rightSide rej', rej);
        }),
        contract.getAllAddressData(FeatureProjectPublicNameType.token).then((res) => {
          pairsInfoArr.token = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.token rej', rej);
        }),
        contract.getAllUintData(FeatureProjectPublicNameType.amount).then((res) => {
          pairsInfoArr.amount = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.amount rej', rej);
        }),
        contract.getAllUintData(FeatureProjectPublicNameType.status).then((res) => {
          pairsInfoArr.status = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.status rej', rej);
        }),
        contract.getAllStringData(FeatureProjectPublicNameType.memoLeftSide).then((res) => {
          pairsInfoArr.memoLeftSide = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.memoLeftSide rej', rej);
        }),
        contract.getAllStringData(FeatureProjectPublicNameType.memoUriLeftSide).then((res) => {
          pairsInfoArr.memoUriLeftSide = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.memoUriLeftSide rej', rej);
        }),
        contract.getAllStringData(FeatureProjectPublicNameType.memoRightSide).then((res) => {
          pairsInfoArr.memoRightSide = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.memoRightSide rej', rej);
        }),
        contract.getAllStringData(FeatureProjectPublicNameType.memoUriRightSide).then((res) => {
          pairsInfoArr.memoUriRightSide = res;
        }).catch((rej) => {
          // console.log('pairsInfoArr.memoUriRightSide rej', rej);
        }),
      ]).then(() => {
        window.pairsInfoArr = pairsInfoArr;
        const arr = [];
        _.map(pairsInfoArr.leftSide, (elem, index) => {
          const pair = {
            leftSide: elem,
            rightSide: pairsInfoArr.rightSide[index],
            token: pairsInfoArr.token[index],
            amount: pairsInfoArr.amount[index]?.toString?.() || '0',
            status: pairsInfoArr.status[index]?.toNumber?.() || 0,
            memoLeftSide: pairsInfoArr.memoLeftSide[index],
            memoUriLeftSide: pairsInfoArr.memoUriLeftSide[index],
            memoRightSide: pairsInfoArr.memoRightSide[index],
            memoUriRightSide: pairsInfoArr.memoUriRightSide[index],
            index,
          };

          if (pair.leftSide === ZERO_ADDRESS) {
            pair.leftSide = undefined;
          }
          if (pair.rightSide === ZERO_ADDRESS) {
            pair.rightSide = undefined;
          }
          arr.push(pair);
        });

        const newArr = {
          ...(_.cloneDeep(defaultPairInfo)),
        };
        _.map(arr, (elem) => {
          if (elem.status === FeatureProjectStatus.abort) {
            newArr.abort.push(elem);
          }
          else if (elem.status === FeatureProjectStatus.withdraw) {
            newArr.withdraw.push(elem);
          }
          else if (elem.leftSide && elem.rightSide) {
            newArr.success.push(elem);
          }
          else {
            newArr.wait.push(elem);
          }
        })

        setPairs(newArr);
        setPairLoading(false);
      }).catch((rej) => {
        console.log('rej', rej);
      });
    }
  }, [
    contract,
    rerenderPair,
    contract?.getAllAddressData,
    contract?.getAllUintData,
  ]);

  const handleApprove = useCallback(async (reset = false) => {
    if (!userAddress) {
      var event = new Event('onSelectWallet');
      document.dispatchEvent(event);
      return Promise.resolve(event);
    }

    setTransactorLoading(true);
    const fields = addForm.getFieldsValue(true);
    console.log('fields', fields);
    const signerOrProvider = signingProvider?.getSigner() ?? readProvider;
    const ERC20Contract = new Contract(fields.token, erc20Abi, signerOrProvider);

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
        }, 3000);
      },
    };

    return transactor(
      ERC20Contract,
      'approve',
      [
        contracts?.FeatureRouter?.address,
        reset ? BigNumber.from("0") : BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
      ],
      txOpts,
    )
  }, [
    transactor,
    addForm,
    signingProvider,
    userAddress,
    setTransactorLoading,
    contracts?.FeatureRouter?.address,
  ]);

  const handleAdd = useCallback(() => {
    if (!userAddress) {
      var event = new Event('onSelectWallet');
      document.dispatchEvent(event);
      setPairModalVisible(false);
      return Promise.resolve(event);
    }

    if (toLowerCase(project.judger) === toLowerCase(userAddress)) {
      if (!window.confirm(t`Judger can play, but make sure your action is not controversial`)) {
        return;
      }
    }

    const fields = addForm.getFieldsValue(true);
    console.log('fields', fields);

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          addForm.resetFields();
          setTransactorLoading(false);
          setPairModalVisible(false);
          setRerenderPair(!rerenderPair);
        }, 3000);
      },
    }

    let amount = '0';
    try {
      amount = parseFixed(fields.amount || 0, fields.decimals);
    }
    catch (err) {
      console.log('err', err);
      alert('please change amount');
      return Promise.reject('amount error');
    }

    setTransactorLoading(true);
    return transactor(
      contracts.FeatureRouter,
      'addPair',
      [
        project.project,
        userAddress,
        fields.token,
        amount,
        isLeftSide,
        fields.memo || '',
        fields.memoUri || '',
      ],
      txOpts,
    )
  }, [
    transactor,
    isLeftSide,
    project?.judger,
    project?.project,
    setRerenderPair,
    rerenderPair,
    setPairModalVisible,
    addForm,
    userAddress,
    contracts?.FeatureRouter,
    setTransactorLoading,
  ]);

  const handleAddModel = (_isLeftSide) => {
    console.log(_isLeftSide);
    setPairModalVisible(true);
    setPairModalKey(Math.random());
    setIsLeftSide(_isLeftSide);
    addForm.resetFields();
  }

  const handleJoinModel = (e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    let td = null;
    let parentNode = e.currentTarget.parentNode;
    while (!td && parentNode) {
      if (parentNode.tagName.toLowerCase() === 'td') {
        td = parentNode;
        parentNode = null;
      }
      else {
        parentNode = parentNode.parentNode;
      }
    }

    if (!td) {
      return;
    }

    const index = td.dataset['index'];
    const mode = td.dataset['mode'];
    let _isLeftSide = false;
    if (mode === 'leftSide') {
      _isLeftSide = true;
    }
    else if (mode === 'rightSide') {
      _isLeftSide = false;
    };

    const pair = _.find(pairs.wait, { index: index * 1 });
    // console.log('pair', pair, 'index', index);
    setJoinPairInfo(pair);
    handleAddModel(_isLeftSide);
  }

  const handleJoin = useCallback(() => {
    const fields = addForm.getFieldsValue(true);
    console.log('fields', fields);

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },
      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          addForm.resetFields();
          setTransactorLoading(false);
          setPairModalVisible(false);
          setRerenderPair(!rerenderPair);
        }, 3000);
      },
    };

    if (toLowerCase(project.judger) === toLowerCase(userAddress)) {
      if (!window.confirm(t`Judger can play, but make sure your action is not controversial`)) {
        return;
      }
    }

    setTransactorLoading(true);
    return transactor(
      contracts.FeatureRouter,
      'joinPair',
      [
        project.project,
        userAddress,
        joinPairInfo.index,
        joinPairInfo.token,
        joinPairInfo.amount,
        isLeftSide,
        fields.memo || '',
        fields.memoUri || '',
      ],
      txOpts,
    )
  }, [
    rerenderPair,
    transactor,
    contracts?.FeatureRouter,
    joinPairInfo?.index,
    joinPairInfo?.token,
    joinPairInfo?.amount,
    isLeftSide,
    project?.judger,
    project?.project,
    setRerenderPair,
    setPairModalVisible,
    addForm,
    userAddress,
    setTransactorLoading,
  ]);

  const handleAbort = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    let td = null;
    let parentNode = e.currentTarget.parentNode;
    while (!td && parentNode) {
      if (parentNode.tagName.toLowerCase() === 'td') {
        td = parentNode;
        parentNode = null;
      }
      else {
        parentNode = parentNode.parentNode;
      }
    }

    if (!td) {
      return ;
    }

    const index = td.dataset['index'];
    const txOpts = {
      onDone: () => {
        // alert('onDone');
        setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setRerenderPair(!rerenderPair);
          setTransactorLoading(false);
        }, 3000);
      },
    };
    setTransactorLoading(true);
    return transactor(
      contract,
      'abort',
      [
        index,
      ],
      txOpts,
    )
  }, [
    transactor,
    contract,
    rerenderPair,
    setRerenderPair,
    setTransactorLoading,
  ]);

  const handleUnsetFeeRate = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
          setRerenderPair(!rerenderPair);
          setUnsetFeeRateModalVisible(false);
        }, 3000);
      },
    };
    setTransactorLoading(true);
    return transactor(
      contract,
      'unsetFeeRate',
      [
      ],
      txOpts,
    )
  }, [
    transactor,
    contract,
    setRerenderPair,
    rerenderPair,
    setTransactorLoading,
    setUnsetFeeRateModalVisible,
  ]);

  const handleWithdrawToken = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
          setRerenderPair(!rerenderPair);
        }, 3000);
      },
    };
    const address = window.prompt('token');
    if (!address) {
      return;
    }

    console.log('address', address);
    setTransactorLoading(true);
    return transactor(
      contract,
      'withdrawToken',
      [
        address,
      ],
      txOpts,
    )
  }, [
    transactor,
    contract,
    setRerenderPair,
    rerenderPair,
    setTransactorLoading,
  ]);

  const handleEnsureFeeRateZero = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
          setRerenderPair(!rerenderPair);
        }, 3000);
      },
    };
    setTransactorLoading(true);
    return transactor(
      contracts.FeatureFactory,
      'ensureFeeRateZero',
      [
        project?.project,
      ],
      txOpts,
    )
  }, [
    transactor,
    project?.project,
    contracts?.FeatureFactory,
    setRerenderPair,
    rerenderPair,
    setTransactorLoading,
  ]);

  const handleAnnounce = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    const win = e.currentTarget.dataset['win'];
    let isLeftSideWin = true;
    if ('leftSide' === win) {
      isLeftSideWin = true;
    }
    else if ('rightSide' === win){
      isLeftSideWin = false;
    }

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
          setRerenderPair(!rerenderPair);
          setJudgementModalVisible(false);
        }, 3000);
      },
    };
    setTransactorLoading(true);
    return transactor(
      contract,
      'makeJudgment',
      [
        isLeftSideWin,
      ],
      txOpts,
    )
  }, [
    transactor,
    contract,
    setRerenderPair,
    rerenderPair,
    setTransactorLoading,
    setJudgementModalVisible,
  ]);

  const handleWithdraw = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    let td = null;
    let parentNode = e.currentTarget.parentNode;
    while (!td && parentNode) {
      if (parentNode.tagName.toLowerCase() === 'td') {
        td = parentNode;
        parentNode = null;
      }
      else {
        parentNode = parentNode.parentNode;
      }
    }

    if (!td) {
      return;
    }

    const index = td.dataset['index'];

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        // setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setRerenderPair(!rerenderPair);
          setTransactorLoading(false);
        }, 3000);

      },
    };

    setTransactorLoading(true);
    return transactor(
      contract,
      'withdraw',
      [
        index,
      ],
      txOpts,
    )
  }, [
    transactor,
    contract,
    setRerenderPair,
    rerenderPair,
    setTransactorLoading,
  ]);

  const handleEnsure = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
          setRerenderPair(!rerenderPair);
        }, 3000);
      },
    };

    setTransactorLoading(true);
    return transactor(
      contract,
      'ensureJudgment',
      [
      ],
      txOpts,
    )
  }, [
    transactor,
    contract,
    setTransactorLoading,
    rerenderPair,
    setRerenderPair,
  ]);

  const handleReject = useCallback((e) => {
    console.log(e);
    window.e = {
      ...e,
    };

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        setTransactorLoading(false);
      },

      onCancelled: () => {
        // alert('onCancelled');
        setTransactorLoading(false);
      },
      onConfirmed: () => {
        setTimeout(() => {
          setTransactorLoading(false);
          setRerenderPair(!rerenderPair);
        }, 3000);
      },
    };

    setTransactorLoading(true);
    return transactor(
      contracts.FeatureFactory,
      'rejectJudgermentPending',
      [
        project.projId,
      ],
      txOpts,
    )
  }, [
    contracts?.FeatureFactory,
    project?.projId,
    setTransactorLoading,
    transactor,
    setRerenderPair,
    rerenderPair,
  ]);

  const now = moment().unix();
  const oneDaySecond = 24 * 60 * 60;

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div style={{ marginBottom: 20 }}>
        {(infoLoading) && <Loading />}
        {(project && project.projId && project.projId !== '0') && <ProjectDetailInfo
          projectChildren={
            (!!project.judgmentPending || !!project.isAnnounced) && <div style={{ marginTop: '1em' }}>
              <div style={{
                whiteSpace: 'normal',
              }}>
                <span style={{
                  color: colors.text.primary,
                  fontWeight: 500,
                  fontSize: '1em',
                }}>
                  Judgment had made as <span style={{
                    fontSize: '2.4em',
                    color: colors.text.failure
                  }}>{project.isLeftSideWin ? 'LeftSide' : 'RightSide'} Win</span>
                </span>
                <span style={{
                  display: !!project.judgmentPending ? '' : 'none',
                  color: colors.text.tertiary,
                  fontWeight: 500,
                  fontSize: '0.7em',
                }}>
                  , Pending Util: {moment.unix(project.judgmentStartTime + oneDaySecond).format('YYYY-MM-DD HH:mm:ss')}
                  {(project.judgmentStartTime + 1 < now) && !project.isAnnounced && <span style={{ marginLeft: '1em' }}><Button loading={transcatorLoading} onClick={handleEnsure}>Ensure</Button> Judgement. </span>}
                </span>
              </div>
            </div>
          }
          judgerChildren={
            toLowerCase(project.judger) === toLowerCase(userAddress) &&
            <div style={{ marginTop: '1em' }}>
              {
                !project.isAnnounced && !project.judgmentPending && now >= project.lockTime && <Button style={{ marginRight: '1em'}} onClick={() => setJudgementModalVisible(true)}>MakeJudgment</Button>
              }
              {
                !project.judgeFeeRateZeroPending && (project.feeRate * 1 > 0) && !project.judgmentStartTime && <Button style={{ marginRight: '1em' }} onClick={() => setUnsetFeeRateModalVisible(true)}>unsetFeeRate</Button>
              }
            </div>
          }
          project={project}
          link={false} /> }
        <Modal
          visible={unsetFeeRateModalVisible}
          footer={null}
          confirmLoading={transcatorLoading}
          width={550}
          onCancel={() => {
            setTransactorLoading(false);
            setUnsetFeeRateModalVisible(false);
          }}
          title="MakeJudgment"
        >
          <div>You can set feeRate to zero.But it not take effect now, you need to contact platform admin to agree this.</div>
          <div>FeeRate can only set to zero buy judger proposal and admin agree. Can't set to other when project created.</div>
          <div>When project start MakeJudgment, Can't unset too.</div>
          <div style={{ marginTop: '1em', marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
            <Button loading={transcatorLoading} onClick={handleUnsetFeeRate}>UnsetFeeRate</Button>
          </div>
        </Modal>
        <Modal
          visible={judgementModalVisible}
          footer={null}
          confirmLoading={transcatorLoading}
          width={550}
          onCancel={() => {
            setTransactorLoading(false);
            setJudgementModalVisible(false);
          }}
          title="MakeJudgment"
        >
          <div>You can make judgment one time a day. Make sure you judgment is justified.</div>
          <div>If judgment is not justified and most of the participant think it's not justified, we will reject this judgment. </div>
          <div>If we will reject this judgment, You should think twice about the judgment and make a new judgment.</div>
          <div>This cycle is unlimited, but it waste time, and wasting credit of Judger</div>
          <div style={{ marginTop: '1em', marginBottom: '1em', display: 'flex', justifyContent: 'space-between'}}>
            <Button loading={transcatorLoading} data-win="leftSide" onClick={handleAnnounce}>LeftSide Win</Button>
            <Button loading={transcatorLoading} data-win="rightSide" onClick={handleAnnounce}>RightSide Win</Button>
          </div>
        </Modal>
        <div style={{ display: 'none'}}>
          info:
          project.isAnnounced: {JSON.stringify(project.isAnnounced)},
          project.isLeftSideWin: {JSON.stringify(project.isLeftSideWin)},
          userAddress: {userAddress},
          project.judgmentPending: {JSON.stringify(project.judgmentPending)}
          project.judgmentStartTime: {moment.unix(project.judgmentStartTime).format('YYYY-MM-DD HH:mm:ss')},
          {project.judgmentPending && project.judgmentStartTime && !project.isAnnounced && <Button loading={transcatorLoading} onClick={handleReject}>Reject(By factory owner)</Button>}
          {project.judgeFeeRateZeroPending && !project.judgmentStartTime && <Button loading={transcatorLoading} onClick={handleEnsureFeeRateZero}>EnsureFeeRateZero(By factory owner)</Button>}
          <Button
            style={{ display: project.isAnnounced ? '' : 'none' }}
            loading={transcatorLoading} onClick={handleWithdrawToken}>WithdrawToken</Button>
        </div>
      </div>
      <React.Fragment>
        {(pairLoading) && <Loading />}
        <table className="project-detail-table-of-pair" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>
                <h1>
                  {t`LeftSide`}
                </h1>
              </th>
              <th style={{ width: '40%' }}>
                <h1>
                  {t`RightSide`}
                </h1>
              </th>
            </tr>
          </thead>
          <tbody>
            {renderPairList({
              project,
              colors,
              pairArr: pairs.wait,
              desc: <h1>Wait for pair</h1>,
              userAddress,
              handleWithdraw,
              handleAbort,
              handleJoinModel,
              TokenInfo,
              transcatorLoading,
            })}
            {
              !project.isAnnounced && !project.judgmentStartTime &&
              <tr>
                <td style={{ textAlign: 'right' }}>
                  <Button size="small" onClick={handleAddModel.bind(this, true)}>Add LeftSide</Button>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button size="small" onClick={handleAddModel.bind(this, false)}>Add RightSide</Button>
                </td>
              </tr>
            }
            {renderPairList({
              project,
              colors,
              pairArr: pairs.success,
              desc: <h1>Success</h1>,
              userAddress,
              handleWithdraw,
              handleAbort,
              handleJoinModel,
              TokenInfo,
              transcatorLoading,
            })}
            {renderPairList({
              project,
              colors,
              pairArr: pairs.withdraw,
              desc: <h1>Withdraw</h1>,
              userAddress,
              handleWithdraw,
              handleAbort,
              handleJoinModel,
              TokenInfo,
              transcatorLoading,
            })}
            {renderPairList({
              project,
              colors,
              pairArr: pairs.abort,
              desc: <h1>Abort</h1>,
              userAddress,
              handleWithdraw,
              handleAbort,
              handleJoinModel,
              TokenInfo,
              transcatorLoading,
            })}
          </tbody>
        </table>
      </React.Fragment>

      {/* add new pair or join old pair */}
      <Modal
        visible={pairModalVisible}
        footer={null}
        width={550}
        onCancel={() => {
          setTransactorLoading(false);
          setPairModalVisible(false);
        }}
        title={!joinPairInfo ? `Add ${isLeftSide ? 'LeftSide' : 'RightSide'}` : `Join ${isLeftSide ? 'LeftSide' : 'RightSide'} at pair #${joinPairInfo?.index}`}
        >
        {pairModalVisible && <AddForm
          key={pairModalKey}
          confirmLoading={transcatorLoading}
          joinPairInfo={joinPairInfo}
          contracts={contracts}
          setModalVisible={setPairModalVisible}
          form={addForm}
          isLeftSide={isLeftSide}
          userAddress={userAddress}
          onCancel={() => {
            setJoinPairInfo(false);
            setPairModalVisible(false);
            setTransactorLoading(false);
          }}
          handleApprove={handleApprove}
          handleAdd={joinPairInfo ? handleJoin : handleAdd}
        />}
      </Modal>
    </div>
  )
}
