import { Button, Form, Input } from 'antd';
import _ from 'lodash';
import { t, Trans } from '@lingui/macro'

const MAX_DESCRIPTION_LENGTH = 1000;

const allowedChars = 'abcdefghijklmnopqrstuvwxyz1234567890_'

export const normalizeHandle = (handle = '') => {
  return `${handle || ''}`
    .toLowerCase()
    .split('')
    .filter((char) => {
      return allowedChars.includes(char)
    })
    .join('')

}


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
        name="judgerName"
        label={t`Your name`}
      >
        <Input
          placeholder={t`Your name`}
          type="string"
          autoComplete="off"
          onChange={(e) => {
            const name = _.get(e, 'target.value', e);
            const val = name ? normalizeHandle(name) : ''
            form.setFieldsValue({ name: val })
          }}
        />
      </Form.Item>

      <Form.Item
        name="judgerDescription"
        label={t`Your description`}
      >
        <Input.TextArea
          autoComplete="off"
          placeholder={MAX_DESCRIPTION_LENGTH + ' ' + t`characters max`}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
      </Form.Item>

      <Form.Item
        name="judgerTwitter"
        label={t`Your Twitter`}
        extra={t`Judger's Twitter handle to show public.`}
      >
        <Input
          prefix={t`@`}
          placeholder={t`featuredao`}
          type="string"
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item>
        {saveButton ?? (
          <Button htmlType="submit" loading={loading} type="primary">
            <Trans>Save Judger details</Trans>
          </Button>
        )}
      </Form.Item>

    </Form>
  );
}
