import MyImage from '@/shared/ui/myImage'
import notFoundArt from '@/assets/images/404-art.png'

function NotFoundPage({ homeHref = '/' }: { homeHref?: string }) {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-3 py-16 text-center">
            <MyImage
                src={notFoundArt}
                alt="404"
                height={180}
                width={180}
                className="w-[180px] h-[180px] mxs:w-[140px] mxs:h-[140px] object-contain"
            />
            <h1 className="mt-10 mxs:mt-8 text-2xl mxs:text-xl font-bold text-neturalDark heading-font">
                404 – Page Not Found
            </h1>
            <p className="mt-3 max-w-md font-medium text-neutral-light text-lg mxs:text-base">
                We couldn’t find the page you were looking for. Try going back to homepage.
            </p>
            <a
                href={homeHref}
                className="mt-8 bg-light-100 text-neturalDark font-medium text-sm py-3 px-8 rounded-full hover:bg-light-200 transition-colors"
            >
                Go back to home
            </a>
        </section>
    )
}

export default NotFoundPage
