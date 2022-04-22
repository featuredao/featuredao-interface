import { Button, Form, Input } from 'antd';
// AutoComplete
import { t, Trans } from '@lingui/macro';
// import _ from 'lodash';

// import { FormItems } from 'components/shared/formItems'
// import { BigNumber } from '@ethersproject/bignumber'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs';
// import { useEffect, useState } from 'react'
// import axios from 'axios';
import ImageUploader from 'components/shared/inputs/ImageUploader';

const MAX_DESCRIPTION_LENGTH = 1000;

export default function ProjectDetailsForm({
  form,
  onFinish,
  saveButton,
  style,
  loading,
}) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={style}>
      <Form.Item
        name="logoUri"
        label={t`Logo`}
      >
        <ImageUploader
          initialUrl={form.getFieldValue('logoUri')}
          onSuccess={logoUri => {
            const prevUrl = form.getFieldValue('logoUri')
            // Unpin previous file
            form.setFieldsValue({ logoUri })
            if (prevUrl) unpinIpfsFileByCid(cidFromUrl(prevUrl))
          }}
          metadata={{ from: 'web' }}
          maxSize={1000000}
          text={t`Upload`}
        />
      </Form.Item>
      <Form.Item
        name="name"
        label={t`Feature Name`}
      >
        <Input placeholder={t`Luna will go upper`}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label={t`Feature description`}
      >
        <Input.TextArea
          autoComplete="off"
          placeholder={t`Next year Luna's price will higer at this time`}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
      </Form.Item>

      <Form.Item
        name="moreInfo"
        label={t`More Info`}
      >
        <Input
          placeholder={t`https://example.com/detail_info`}
          type="string"
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item>
        {saveButton ?? (
          <Button htmlType="submit" loading={loading} type="primary">
            <Trans>Save feature details</Trans>
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
