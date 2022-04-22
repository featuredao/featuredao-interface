import axios from 'axios'
import { consolidateMetadata } from 'models/project-metadata'
import { ipfsCidUrl } from 'utils/ipfs'
import { useQuery } from 'react-query'

export function useProjectMetadata(cid, file) {
  return useQuery(
    ['project-metadata', cid, file],
    async () => {
      if (!cid) {
        throw new Error('Project cid not specified.')
      }
      const url = ipfsCidUrl(cid, file)
      const response = await axios.get(url)
      return consolidateMetadata(response.data)
    },
    {
      enabled: !!cid,
      staleTime: 60000,
    },
  )
}
