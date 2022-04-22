import { Button, Form } from 'antd'
import { t, Trans } from '@lingui/macro'
// import _ from 'lodash';

import NumberSlider from 'components/shared/inputs/NumberSlider'

export default function ProjectDetailsForm({
  form,
  onFinish,
  // hideProjectHandle = false,
  saveButton,
  style,
  loading,
}) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={style}>
      <Form.Item
        extra={t`Judger and Feature get the feeRate/1000 fee of the token you win. Like: you win 1000 WETH, feeRate is 3, Judger will receive 3 WETH, Feature will receive 3 WETH. You get 996 WETH finally.`}
        name="feeRate"
        label={t`Fee rate`}
        style={style}
        initialValue={3}
      >
        <NumberSlider
          suffix="/1000"
          min={3}
          max={200}
          onChange={(val) => {
            form.setFieldsValue({ feeRate: val });
          }}
          step={1}
        />
      </Form.Item>

      <Form.Item>
        {saveButton ?? (
          <Button htmlType="submit" loading={loading} type="primary">
            <Trans>Save fee rate</Trans>
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
