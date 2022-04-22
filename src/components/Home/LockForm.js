import { Button, Form, DatePicker, Space, Switch } from 'antd';
import { t, Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';
// import _ from 'lodash';

import * as moment from 'moment';
window.moment = moment;

const formatToDay = 'YYYY-MM-DD';
const formatToSecond = `${formatToDay} HH:mm:ss`;
export const defaultLockDay = moment(moment().format(formatToDay), formatToDay).add(1, 'months').add(1, 'days');

export default function ProjectDetailsForm({
  form,
  onFinish,
  // hideProjectHandle = false,
  saveButton,
  style,
  loading,
}) {

  const [hasLockTime, setHasLockTime] = useState(form.getFieldValue('hasLockTime') || false);
  const [lockTime, setLockTime] = useState();

  useEffect(() => {
    setHasLockTime(form.getFieldValue('hasLockTime'));
  }, [
    // form.getFieldValue('hasLockTime'),
    form,
  ]);

  useEffect(() => {
    setLockTime(form.getFieldValue('lockTime') ? moment.unix(form.getFieldValue('lockTime')) : undefined);
  }, [
    // form.getFieldValue('lockTime'),
    form,
  ]);
  // console.log("form.getFieldValue('lockTime')", form.getFieldValue('lockTime'));

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={style}>
      <Form.Item name="hasLockTime">
        <Space>
          <Switch
            checked={hasLockTime}
            onChange={(checked) => {
              setHasLockTime(checked);
              // console.log('checked', checked);
              const options = {
                hasLockTime: checked,
              };
              if (!checked) {
                options.lockTime = 0;
              }
              else {
                options.lockTime = defaultLockDay.unix();
                setLockTime(defaultLockDay);
              }
              form.setFieldsValue(options);
            }}
          />
          <label>
            <Trans>Set lock time</Trans>
          </label>
        </Space>
      </Form.Item>

      {hasLockTime && <Form.Item
        name="lockTime"
        extra="The time to announce the result until."
        label={t`Lock time`}
      >
        <Space>
          <DatePicker
            value={lockTime}
            format={formatToSecond}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={(val) => {
              setLockTime(val);
              form.setFieldsValue({
                lockTime: moment.isMoment(val) ? val.unix() : 0,
              });
            }}
            placeholder={t`Choose lock time`}
          />
        </Space>
      </Form.Item>
      }

      <Form.Item>
        {saveButton ?? (
          <Button htmlType="submit" loading={loading} type="primary">
            <Trans>Save lock time</Trans>
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
