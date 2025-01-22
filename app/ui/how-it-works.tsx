export default async function HowItWorksRow({
  index,
  title,
  subtitle,
  videoPath,
}: {
  index: number;
  title: string;
  subtitle: string;
  videoPath?: string;
}) {
  return (
    <div className="w-full flex items-center justify-center flex-wrap my-12">
      <div className="md:w-2/3 flex flex-col items-center justify-center gap-4 p-6">
        {/* Title */}
        <div className="w-full flex justify-between items-center gap-3">
          <div className="shrink-0 size-20 flex justify-center items-center border-2 border-primary bg-primarybg rounded-xl">
            <p className="text-5xl text-primary font-bold">{index}</p>
          </div>
          <div className="grow">
            <p className="font-bold text-3xl md:text-5xl text-center">
              {title}
            </p>
          </div>
        </div>
        {/* Subtitle */}
        <p className="text-lg md:ml-20 leading-loose">{subtitle}</p>
      </div>
      {videoPath && (
        <div className="flex grow items-center justify-center w-1/3">
          <video
            className="rounded-xl shadow-2xl border-2 border-primary"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoPath} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
