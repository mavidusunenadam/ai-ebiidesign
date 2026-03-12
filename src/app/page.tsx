import Uploader from "@/components/uploader";

export default function HomePage() {
  return (
    <main className="container-app py-10">
      <div className="flex flex-col gap-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="badge mb-4">ai.ebiidesign.com</span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Fotoğrafını yükle,
            <br />
            AI ile t-shirt’e dönüştür
          </h1>
          <p className="helper mt-4 text-base md:text-lg">
            Tek yüklemede 4 farklı stil üret: Rockwell, Ghibli, Anime,
            Karikatür.
          </p>
        </div>

        <Uploader />
      </div>
    </main>
  );
}