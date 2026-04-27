//src/components/features/news/NewsRdvSection.jsx

export default function NewsRdvSection({ rendezVous, rendezVousText, rendezVousDate, rendezVousHourRange, lang }) {
    return (
        <div
            key={rendezVous?.id ?? `${rendezVous?.Title ?? 'rendez-vous'}-${rendezVous?.EventDate ?? ''}`}
            className='bg-linear-to-t from-primary to-light to-80% p-[10px] mt-[10px]'
        >
            <div className='md:grid md:grid-cols-6 md:gap-[10px]'>
                <div className='md:col-span-4'>
                    <div className='max-w-[90%]'>
                        {rendezVous?.Title ? (
                            <h3 className='mb-h3-margin'>{rendezVous.Title}</h3>
                        ) : null}
                        {rendezVousText ? <p>{rendezVousText}</p> : null}
                    </div>
                </div>
                <div className='md:col-span-1'>

                    {Array.isArray(rendezVous?.Links) && rendezVous.Links.length > 0 ? (
                        <ul>
                            {rendezVous.Links.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.Url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <span className='inline pr-h3-margin'>&#8599;</span>
                                        {link.LinkTitle || link.Url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
                <div className='md:col-span-1'>
                    {rendezVousDate ? <p> {lang === "fr" ? "le " : "on "} {rendezVousDate}</p> : null}
                    {rendezVousHourRange ? <p>{rendezVousHourRange}</p> : null}
                    {(rendezVous?.Place || rendezVous?.Address) ? (
                        <p>
                            {rendezVous?.Place ? <span>{rendezVous.Place}</span> : null}
                            {rendezVous?.Place && rendezVous?.Address ? <br /> : null}
                            {rendezVous?.Address ? (
                                <address className='not-italic inline'>{rendezVous.Address}</address>
                            ) : null}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
