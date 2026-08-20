import SubBanner from '../subBanner'
import EmptyState from '../emptyState'
import IconDownload from '@/shared/icon/download'
import IconEye from '@/shared/icon/eye'
import { withS3Prefix, formatFileSize } from '@/shared/utils/seo-utils'

type PublishedSeo = Record<string, unknown>

type ClubFile = {
    sId?: string
    sFileName?: string
    sFileUrl?: string
    sFileSize?: number
    sMimeType?: string
}

function FilesPage({
    publishedSeo,
    filesData
}: {
    publishedSeo?: PublishedSeo,
    filesData?: any
}) {
    const oPage = filesData?.oPage || filesData || {}
    const oHeader = oPage?.oHeader || {}
    const aModules = oPage?.aModules || []
    const filesModule = aModules.find((m: any) => m.sKey === 'files')
    const aFiles: ClubFile[] = filesModule?.oPayload?.aFiles || []

    return (
        <>
            <SubBanner
                title={oHeader?.sTitle || (publishedSeo?.title as string)}
                description={oHeader?.sSubtitle || (publishedSeo?.sClubName as string) || 'Woburn Sands Tennis Club'}
                bgImage={oHeader?.oHeaderImage?.sFileUrl}
            />
            <div className='max-w-[944px] mx-auto px-3 py-[128px] mxs:py-10'>
                {aFiles.length > 0 ? (
                    <div className='grid ssm:grid-cols-2 gap-4'>
                        {aFiles.map((file, index) => {
                            const sFileUrl = withS3Prefix(file.sFileUrl)
                            return (
                                <div
                                    key={file.sId || index}
                                    className='flex items-center gap-4 justify-between bg-light-100 rounded-lg px-6 py-4'
                                >
                                    <div className='min-w-0'>
                                        <p className='text-neutral-dark font-medium truncate'>{file.sFileName || 'File'}</p>
                                        <p className='text-neutral-light text-sm mt-1'>{formatFileSize(file.sFileSize)}</p>
                                    </div>
                                    <div className='flex items-center gap-2 flex-shrink-0'>
                                        {sFileUrl && (
                                            <>
                                                <a
                                                    href={sFileUrl}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    aria-label={`View ${file.sFileName}`}
                                                    className='w-8 h-8 flex items-center justify-center rounded-full bg-light-200 text-neutral-medium hover:text-primary transition-colors'
                                                >
                                                    <span className='w-4 h-4 block'><IconEye /></span>
                                                </a>
                                                <a
                                                    href={sFileUrl}
                                                    download={file.sFileName}
                                                    aria-label={`Download ${file.sFileName}`}
                                                    className='w-8 h-8 flex items-center justify-center rounded-full bg-light-200 text-neutral-medium hover:text-primary transition-colors'
                                                >
                                                    <span className='w-4 h-4 block'><IconDownload /></span>
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <EmptyState description='No files are currently available.' />
                )}
            </div>
        </>
    )
}

export default FilesPage
