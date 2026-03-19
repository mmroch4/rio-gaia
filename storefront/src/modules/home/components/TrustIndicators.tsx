const indicators = [
  {
    title: "Clientes B2B",
    value: "500+",
  },
  {
    title: "Peças Produzidas/Ano",
    value: "50k+",
  },
  {
    title: "Anos de Experiência",
    value: "15+",
  },
  {
    title: "Taxa de Satisfação",
    value: "98%",
  },
];


export function TrustIndicators() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-between 
        ">
          {indicators.map((indicator, idx) => (
            <div key={"trust_indicator_" + idx} className="bg-[#0047AB] flex flex-col justify-center min-h-36 rounded-lg p-6 text-center text-white">
              <div className="text-4xl font-bold leading-none">{indicator.value}</div>
              <div className="text-blue-100 mt-2">{indicator.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
