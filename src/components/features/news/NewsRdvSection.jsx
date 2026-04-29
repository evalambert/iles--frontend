//src/components/features/news/NewsRdvSection.jsx

export default function NewsRdvSection({ rendezVous, rendezVousText, rendezVousDate, rendezVousHourRange, lang }) {
    return (
        <div
            key={rendezVous?.id ?? `${rendezVous?.Title ?? 'rendez-vous'}-${rendezVous?.EventDate ?? ''}`}
            className='bg-linear-to-t from-primary to-light to-80% p-[10px] mt-[10px]'
        >
            <div className='md:grid md:grid-cols-6 md:gap-[10px]'>
                <div className='md:col-span-4'>
                    <div className='max-w-[90%] wysiwyg'>
                        {rendezVous?.Title ? (
                            <h3 className=''>{rendezVous.Title}</h3>
                        ) : null}
                        {rendezVousText ? <p>{rendezVousText}
                        </p> : null}
                    </div>
                </div>
                <div className='md:col-span-2 grid grid-cols-2 md:gap-[10px] max-md:mt-[20px] max-md:mx-[-10px] max-md:bg-primary'>
                    <div className='col-span-1 max-md:bg-linear-to-t max-md:from-primary max-md:to-light max-md:to-80% max-md:p-[10px] max-md:h-fit flex flex-col gap-[23px] pb-[23px]'>

                        {Array.isArray(rendezVous?.Links) && rendezVous.Links.length > 0 ? (
                            <ul>
                                {rendezVous.Links.map((link) => (
                                    <>

                                        <li key={link.id}>
                                            <a
                                                href={link.InstagramUrl}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                            >
                                                <span className='inline pr-h3-margin'>&#8599;</span>
                                                {link.InstagramName || link.InstagramUrl}
                                            </a>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                    <div className='col-span-1 max-md:bg-linear-to-t max-md:from-primary max-md:to-light max-md:to-80% max-md:p-[10px] max-md:h-fit flex flex-col gap-[23px] pb-[23px]'>
                        <div className="flex flex-col gap-[10px]">
                            <h3 className=''>
                                {lang === 'fr'
                                    ? 'Date(s) :'
                                    : 'Date(s) :'}
                            </h3>
                            <div>
                                {rendezVousDate ? <p> {lang === "fr" ? "le " : "on "} {rendezVousDate}</p> : null}
                                {rendezVousHourRange ? <p>{rendezVousHourRange}</p> : null}
                            </div>
                        </div>
                        {(rendezVous?.Place || rendezVous?.Address) ? (
                            <div className="flex flex-col gap-[10px]">
                                <h3 className=''>
                                    {lang === 'fr'
                                        ? 'Lieu :'
                                        : 'Location :'}
                                </h3>
                                <p>
                                    {rendezVous?.Place ? <span>{rendezVous.Place}</span> : null}
                                    {rendezVous?.Place && rendezVous?.Address ? <br /> : null}
                                    {rendezVous?.Address ? (
                                        <address className='not-italic inline'>{rendezVous.Address}</address>
                                    ) : null}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
