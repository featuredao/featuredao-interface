import { CloseCircleFilled } from '@ant-design/icons'
import { FileImageOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Image, Col, message, Row, Space, Upload } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useLayoutEffect, useState } from 'react'
import { ipfsCidUrl, pinFileToIpfs } from 'utils/ipfs'

import ExternalLink from '../ExternalLink'

export default function ImageUploader({
  initialUrl,
  onSuccess,
  maxSize,
  metadata,
  text,
}) {
  const [url, setUrl] = useState(initialUrl)
  const [loadingUpload, setLoadingUpload] = useState()

  const { theme } = useContext(ThemeContext)

  const setValue = (newUrl) => {
    const newUrlChecked = newUrl ? newUrl : undefined;
    setUrl(newUrlChecked);
    onSuccess && onSuccess(newUrlChecked);
  }

  useLayoutEffect(() => setUrl(initialUrl), [initialUrl]);

  return (
    <Row
      style={{
        color: theme.colors.text.secondary,
      }}
      gutter={30}
    >
      <Col xs={24} md={7}>
        <Space align="start">
          {url && (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <Image
              style={{
                maxHeight: 80,
                maxWidth: 120,
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: theme.radii.md,
              }}
              src={url}
              alt="Uploaded image"
            />
          )}

          {url ? (
            <Button
              icon={<CloseCircleFilled />}
              type="text"
              onClick={() => setValue()}
            />
          ) : (
            <Upload
              accept="image/png, image/jpeg, image/jpg, image/gif"
              beforeUpload={file => {
                if (maxSize !== undefined && file.size > maxSize * 1000) {
                  message.error('File must be less than ' + maxSize + 'KB')
                  return Upload.LIST_IGNORE
                }
              }}
              customRequest={async req => {
                setLoadingUpload(true)
                const res = await pinFileToIpfs(req.file, metadata)
                const url = ipfsCidUrl(res.cid, res.filename);
                setValue(url);
                setLoadingUpload(false)
              }}
            >
              <Button loading={loadingUpload} type="text">
                <FileImageOutlined /> {text ?? null}
              </Button>
            </Upload>
          )}
        </Space>
      </Col>

      <Col xs={24} md={17}>
        {url?.length ? (
          <span
            style={{
              fontSize: '.7rem',
              wordBreak: 'break-all',
              textOverflow: 'ellipsis',
            }}
          >
            <Trans>
              Uploaded to: <ExternalLink href={url}>{url}</ExternalLink>
            </Trans>
          </span>
        ) : null}
      </Col>
    </Row>
  )
}
