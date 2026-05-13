import { Beer } from "@/types/beer";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import Image from "next/image";
import No_Image_available from "../../public/No_Image_Available.webp";

function BeerCard({ beer }: { beer: Beer }) {
  console.log("Rendering BeerCard for:", beer.ProductImageURL);
  return (
    <Card className="w-full hover:shadow-xl transition-all duration-180 hover:scale-[1.02] bg-white/80 backdrop-blur-sm flex flex-col">
      <CardBody className="p-0 flex-grow">
        <div className="relative overflow-hidden">
          <Image
            src={No_Image_available}
            alt={beer.ProductName}
            width={400}
            height={300}
            className="w-full h-56 object-cover transition-transform duration-180 hover:scale-110"
          />
          <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ${beer.ProductPrice.toFixed(2)}
          </div>
        </div>
        <div className="px-5 py-3">
          <h3 className="text-xl font-bold text-default-900 mb-1 line-clamp-2">
            {beer.ProductName}
          </h3>
          {beer.ProductNameThin && (
            <p className="text-sm text-default-500 mb-2 italic">
              {beer.ProductNameThin}
            </p>
          )}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-default-400">🌍</span>
              <span className="font-medium text-default-700">{beer.ProductCountry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-default-400">🍺</span>
              <span className="font-medium text-default-700">{beer.ProductCategory}</span>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <span className="text-default-400">📏</span>
                <span className="text-default-600">{beer.ProductVolume}ml</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-default-400">🔥</span>
                <span className="font-semibold text-warning-600">{beer.ProductAlcohol}%</span>
              </div>
              {beer.ProductApk && (
                <div className="flex items-center gap-1">
                  <span className="text-default-400">⭐</span>
                  <span className="text-default-600">{beer.ProductApk.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          {beer.ProductInfo && (
            <p className="text-sm text-default-600 line-clamp-3 leading-relaxed">
              {beer.ProductInfo}
            </p>
          )}
        </div>
      </CardBody>
      <CardFooter className="pt-0 px-5 pb-3">
        <Button 
          color="primary" 
          variant="shadow" 
          className="w-full font-semibold"
          size="lg"
          onPress={() => {
            // TODO: Implement show more functionality
            console.log(`Show more for ${beer.ProductName}`);
          }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BeerCard;