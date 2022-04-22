import { BigNumber } from '@ethersproject/bignumber';
// import _ from 'lodash';
// import * as moment from 'moment';
import { useForm } from 'antd/lib/form/Form';
import { CaretRightFilled, CheckCircleFilled } from '@ant-design/icons';
import { useCallback, useContext, createContext, useEffect, useMemo, useState } from 'react';
import { Modal, Button, Col, Drawer, Row, Space } from 'antd';
import { t, Trans } from '@lingui/macro';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'hooks/AppDispatch';
import { editingProjectActions } from 'redux/slices/editingProject';
import { UserContext } from 'contexts/userContext';
import { ThemeContext } from 'contexts/themeContext';

import ProjectDetailsForm from './ProjectDetailsForm';
import JudgerForm from './JudgerForm';
import LockForm from './LockForm';
import FeeForm from './FeeForm';
import { NetworkContext } from 'contexts/networkContext';
import ProjectDetailInfo from 'components/shared/ProjectDetailInfo';

export const ProjectContext = createContext({});

export const useAppSelector = useSelector;

export const drawerStyle = {
  placement: 'right',
  width: Math.min(640, window.innerWidth * 0.9),
}

const spacing = 40;

export default function Create() {
  const dispatch = useAppDispatch()
  const [projectForm] = useForm();
  const [judgerForm] = useForm();
  const [lockForm] = useForm();
  const [feeForm] = useForm();


  const editingProject = useAppSelector(state => state.editingProject);
  window.editingProject = editingProject;

  const editingLock = useMemo(() => {
    return {
      ...editingProject.lock,
    };
  }, [
    editingProject.lock,
  ]);
  const editingJudger = useMemo(() => {
    return {
      ...editingProject.judger,
    }
  }, [
    editingProject.judger
  ]);
  const editingFee = useMemo(() => {
    return {
      ...editingProject.fee,
    };
  }, [
    editingProject.fee
  ]);
  const editingProjectDetail = useMemo(() => {
    return {
      ...editingProject.detail,
    };
  }, [
    editingProject.detail
  ]);

  const [confirmStartOverVisible, setConfirmStartOverVisible] = useState(false);
  const [deployProjectModalVisible, setDeployProjectModalVisible] =
    useState(false);
  const [viewedSteps, setViewedSteps] = useState([]);
  const memoizedDrawerStyle = useMemo(() => drawerStyle, [])

  const [projectFormModalVisible, setProjectFormModalVisible] =
    useState(false);
  const [judgerFormModalVisible, setJudgerFormModalVisible] =
    useState(false);
  const [lockFormModalVisible, setLockFormModalVisible] =
    useState(false);
  const [feeFormModalVisible, setFeeFormModalVisible] =
    useState(false);
  const { colors, radii } = useContext(ThemeContext).theme;
  const [currentStep, setCurrentStep] = useState();
  const { signerNetwork, userAddress } = useContext(NetworkContext);
  const { transactor, contracts } = useContext(UserContext);

  const onProjectFormSaved = useCallback(() => {
    const fields = projectForm.getFieldsValue(true);
    // console.log('fields', fields);
    dispatch(editingProjectActions.setDetail(fields));
  }, [dispatch, projectForm]);
  const resetProjectForm = useCallback(() => {
    projectForm.setFieldsValue({
      name: editingProjectDetail?.name ?? '',
      logoUri: editingProjectDetail?.logoUri ?? '',
      description: editingProjectDetail?.description ?? '',
      moreInfo: editingProjectDetail?.moreInfo ?? '',
    });
  }, [
    editingProjectDetail.logoUri,
    editingProjectDetail.name,
    editingProjectDetail.description,
    editingProjectDetail.moreInfo,
    projectForm,
  ]);
  useEffect(() => {
    resetProjectForm();
  }, [resetProjectForm]);

  const onJudgerFormSaved = useCallback(() => {
    const fields = judgerForm.getFieldsValue(true);
    dispatch(editingProjectActions.setJudger(fields));
  }, [dispatch, judgerForm]);
  const resetJudgerForm = useCallback(() => {
    judgerForm.setFieldsValue({
      judgerName: editingJudger?.judgerName ?? '',
      judgerDescription: editingJudger?.judgerDescription ?? '',
      judgerTwitter: editingJudger?.judgerTwitter ?? '',
    });
  }, [
    editingJudger.judgerName,
    editingJudger.judgerDescription,
    editingJudger.judgerTwitter,
    judgerForm,
  ]);
  useEffect(() => {
    resetJudgerForm();
  }, [resetJudgerForm]);

  const onLockFormSaved = useCallback(() => {
    const fields = lockForm.getFieldsValue(true);
    if (!fields.hasLockTime) {
      fields.lockTime = 0;
    }
    dispatch(editingProjectActions.setLock(fields));
  }, [dispatch, lockForm]);
  const resetLockForm = useCallback(() => {
    const options = {};
    options.hasLockTime = editingLock.hasLockTime || false;
    options.lockTime = editingLock.lockTime || 0;
    lockForm.setFieldsValue(options);
  }, [
    editingLock.lockTime,
    editingLock.hasLockTime,
    lockForm,
  ]);
  useEffect(() => {
    resetLockForm();
  }, [resetLockForm]);

  const onFeeFormSaved = useCallback(() => {
    const fields = feeForm.getFieldsValue(true);
    // console.log('fields', fields);
    dispatch(editingProjectActions.setFee(fields));
  }, [dispatch, feeForm]);
  const resetFeeForm = useCallback(() => {
    feeForm.setFieldsValue({
      feeRate: editingFee?.feeRate ?? BigNumber.from(3),
    });
  }, [
    editingFee.feeRate,
    feeForm,
  ]);
  useEffect(() => {
    resetFeeForm();
  }, [resetFeeForm]);

  const resetAllForm = useCallback(() => {
    resetProjectForm();
    resetJudgerForm();
    resetLockForm();
    resetFeeForm();
  }, [
    resetProjectForm,
    resetJudgerForm,
    resetLockForm,
    resetFeeForm,
  ]);

  const project = useMemo(() => ({
    projId: 0,
    lockTime: editingLock.lockTime || 0,
    feeRate: editingFee?.feeRate ? `${editingFee?.feeRate}0` : '0',
    projInfo: [
      editingProjectDetail.name ?? '',
      editingProjectDetail.logoUri ?? '',
      editingProjectDetail?.description ?? '',
      editingProjectDetail?.moreInfo ?? '',
    ],

    judgerInfo: [
      editingJudger?.judgerName ?? '',
      editingJudger?.judgerDescription ?? '',
      editingJudger?.judgerTwitter ?? '',
    ],
  }),
    [
      editingProjectDetail,
      editingJudger,
      editingLock,
      editingFee,
    ],
  )

  const buildSteps = useCallback((steps = []) => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {steps.map((step, i) => {
        const active = currentStep === i
        const viewed = viewedSteps.includes(i)

        return (
          <div
            key={step.title}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              cursor: 'pointer',
              padding: 15,
              borderRadius: radii.sm,
              fontWeight: viewed ? 500 : 600,
              color: viewed
                ? colors.text.primary
                : colors.text.action.primary,
              borderColor: viewed
                ? colors.stroke.secondary
                : colors.stroke.action.primary,
              borderStyle: 'solid',
              borderWidth: `1px 1px 1px ${active ? '10px' : '1px'}`,
            }}
            role="button"
            onClick={() => {
              if (currentStep !== undefined) return
              setCurrentStep(i)
              step.callback()
            }}
          >
            <div
              style={{
                marginRight: 15,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                marginRight: 10,
                flex: 1,
              }}
            >
              <div>{step.title}</div>
              <div
                style={{
                  color: colors.text.secondary,
                  fontWeight: 400,
                  fontSize: '0.75rem',
                }}
              >
                {step.description}
              </div>
            </div>
            <div
              style={{
                alignSelf: 'center',
                color: viewed
                  ? colors.text.secondary
                  : colors.text.action.primary,
              }}
            >
              {viewed ? <CheckCircleFilled /> : <CaretRightFilled />}
            </div>
          </div>
        )
      })}

      <p style={{ fontWeight: 500 }}>
        <Trans>
          The Feature protocol is unaudited, and features built on it may be
          vulnerable to bugs or exploits. Be smart!
        </Trans>
      </p>

      <div
        style={{
          display: 'flex',
        }}
      >
        <Button
          onClick={() => setConfirmStartOverVisible(true)}
          type="ghost"
          block
          style={{ marginRight: 8 }}
        >
          <Trans>Start Over</Trans>
        </Button>

        <Button
          onClick={() => setDeployProjectModalVisible(true)}
          type="primary"
          block
          disabled={
            !editingProjectDetail.description || !editingJudger.judgerName
          }
        >
          <Trans>Review & Deploy</Trans>
        </Button>
      </div>
    </Space>
  ),
  [
    // editingProjectDetail.metadata.name,
    editingJudger.judgerName,
    editingProjectDetail.description,
    currentStep,
    viewedSteps,
    radii.sm,
    colors.text.primary,
    colors.text.action.primary,
    colors.text.secondary,
    colors.stroke.secondary,
    colors.stroke.action.primary,
  ]);

  const [loadingCreate, setLoadingCreate] = useState();
  const viewedCurrentStep = useCallback(() => {
    if (currentStep !== undefined && !viewedSteps.includes(currentStep)) {
      setViewedSteps([...viewedSteps, currentStep])
    }
    setCurrentStep(undefined)
  }, [currentStep, viewedSteps]);

  const deployProject = async () => {
    if (!userAddress) {
      var event = new Event('onSelectWallet');
      document.dispatchEvent(event);
      setDeployProjectModalVisible(false);
      return Promise.resolve(event);
    }


    setLoadingCreate(true);

    const txOpts = {
      onDone: () => {
        // alert('onDone');
        setLoadingCreate(false);
      },
      onCancelled: () => {
        // alert('onCancelled');
      },
      onConfirmed: () => {
        setLoadingCreate(false);
        // alert('onConfirmed');
        setDeployProjectModalVisible(false);

        resetAllForm();
        dispatch(editingProjectActions.resetState());
        // go to all projects.find your self.
        
        window.location.hash = '/#/feature/';
      },
    };

    if (!transactor || !userAddress || !contracts?.FeatureFactory) {
      txOpts?.onDone?.()
      return Promise.resolve(false);
    }

    return transactor(
      contracts.FeatureFactory,
      'createProj',
      [
        `${project.lockTime}`,
        `${project.feeRate}`,
        project.projInfo,
        project.judgerInfo,
      ],
      txOpts,
    )
  }


  return (
    <ProjectContext.Provider value={project}>
      <Row style={{ marginTop: 40 }}>
        <Col
          xs={24}
          md={10}
          style={{
            marginBottom: spacing * 2,
            paddingLeft: spacing,
            paddingRight: spacing,
          }}
        >
          <h1 style={{ marginBottom: spacing / 2 }}>
            <Trans>Design your feature</Trans> 🎨
          </h1>

          {buildSteps([
            {
              title: t`Feature details`,
              description: t`Feature name, description and more info.`,
              callback: () => setProjectFormModalVisible(true),
            },
            {
              title: t`Your info`,
              description: t`Your info like name, description and twitter to be a fair Judger`,
              callback: () => setJudgerFormModalVisible(true),
            },
            {
              title: t`Lock time`,
              description: t`Set lock time or not, default no lock time and judger can announce any time.`,
              callback: () => setLockFormModalVisible(true),
            },
            {
              title: t`Fee rate`,
              description: t`The percentage of the amount you win to pay for judger and factory. It's between [3-200]/1000, default is 3/1000`,
              callback: () => setFeeFormModalVisible(true),
            },
          ])}
        </Col>

        <Col xs={24} md={14}>
          <h3
            style={{
              marginTop: 5,
              marginBottom: spacing / 2,
              color: colors.text.secondary,
              paddingLeft: spacing,
              paddingRight: spacing,
            }}
          >
            <Trans>Preview</Trans>:
          </h3>

          <div
            style={{
              paddingLeft: spacing,
              paddingRight: spacing,
              borderLeft: '1px solid ' + colors.stroke.tertiary,
            }}
          >
            {/* <ProjectCard project={project} /> */}
            <ProjectDetailInfo project={project} />
          </div>
        </Col>

        <Drawer
          {...memoizedDrawerStyle}
          visible={projectFormModalVisible}
          onClose={() => {
            setCurrentStep(undefined)
            resetProjectForm()
            setProjectFormModalVisible(false)
          }}
        >
          <Space direction="vertical" size="large">
            <h1>
              <Trans>Feature details</Trans>
            </h1>
            <p>
              <Trans>
                Changes to these attributes can be made at one time and will be
                applied to your feature immediately.
              </Trans>
            </p>
            <ProjectDetailsForm
              form={projectForm}
              onFinish={() => {
                setCurrentStep(undefined)
                viewedCurrentStep()
                onProjectFormSaved()
                setProjectFormModalVisible(false)
              }}
            />
          </Space>
        </Drawer>

        <Drawer
          {...memoizedDrawerStyle}
          visible={judgerFormModalVisible}
          onClose={() => {
            setCurrentStep(undefined)
            resetJudgerForm()
            setJudgerFormModalVisible(false)
          }}
          destroyOnClose
        >
          <Space direction="vertical" size="large">
            <h1>
              <Trans>Your(Judger) details</Trans>
            </h1>
            <p>
              <Trans>
                Who create the feature is the Judger.
                And send the feature detail to tell anyother to join.
              </Trans>
            </p>
            <p>
              <Trans>
                Anyone can create feature, we are added some Judger to list as authoritative Judger.So Be fair at the end time, If you want to be add, be fair anytime and contract us.
              </Trans>
            </p>
            <JudgerForm
              form={judgerForm}
              onFinish={() => {
                setCurrentStep(undefined)
                viewedCurrentStep()
                onJudgerFormSaved()
                setJudgerFormModalVisible(false)
              }}
            />
          </Space>
        </Drawer>

        <Drawer
          {...memoizedDrawerStyle}
          visible={lockFormModalVisible}
          onClose={() => {
            setLockFormModalVisible(false)
            viewedCurrentStep()
            resetLockForm()
          }}
          destroyOnClose
        >
          <Space direction="vertical" size="large">
            <h1>
              <Trans>Lock Time details</Trans>
            </h1>
            <p>
              <Trans>
                If lock time set, feature will announce util lock time.
              </Trans>
            </p>
            <LockForm
              form={lockForm}
              onFinish={() => {
                setLockFormModalVisible(false)
                viewedCurrentStep()
                setCurrentStep(undefined)
                onLockFormSaved()
              }}
            />
          </Space>
        </Drawer>

        <Drawer
          {...memoizedDrawerStyle}
          visible={feeFormModalVisible}
          onClose={() => {
            viewedCurrentStep()
            resetFeeForm()
            setFeeFormModalVisible(false)
          }}
          destroyOnClose
        >
          <Space direction="vertical" size="large">
            <h1>
              <Trans>Lock Time details</Trans>
            </h1>
            <p>
              <Trans>
                If lock time set, featue will announce util lock time.
              </Trans>
            </p>
            <FeeForm
              form={feeForm}
              onFinish={() => {
                setFeeFormModalVisible(false)
                setCurrentStep(undefined)
                viewedCurrentStep()
                onFeeFormSaved()
              }}
            />
          </Space>
        </Drawer>

        <Modal
          visible={deployProjectModalVisible}
          okText={
            userAddress
              ? signerNetwork
                ? t`Deploy Feature on ${signerNetwork}`
                : t`Deploy Feature`
              : t`Connect wallet to deploy`
          }
          onOk={deployProject}
          confirmLoading={loadingCreate}
          width={800}
          onCancel={() => setDeployProjectModalVisible(false)}
        >
          <div style={{ marginTop: 20 }}>
            <ProjectDetailInfo project={project} />
          </div>
        </Modal>

        <Modal
          visible={confirmStartOverVisible}
          okText={t`Start Over`}
          okType="danger"
          title={t`Are you sure you want to start over?`}
          onOk={() => {
            dispatch(editingProjectActions.resetState())
            resetProjectForm();
            resetJudgerForm();
            resetLockForm();
            resetFeeForm();
            setConfirmStartOverVisible(false)
          }}
          onCancel={() => setConfirmStartOverVisible(false)}
        >
          <Trans>This will erase all of your changes.</Trans>
        </Modal>
      </Row>
    </ProjectContext.Provider>
    );
}
