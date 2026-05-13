'use client';
import { Store } from "@/types/store";
import { Card, CardBody, Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function StoreCard({ store }: { store: Store }) {
  const router = useRouter();

  const handleStoreClick = () => {
    router.push(`/stores/${store.id}`);
  };

  return (
    <Card 
      className="w-full hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-2 border-transparent hover:border-primary-200"
      isPressable
      onPress={handleStoreClick}
    >
      <CardBody className="p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">
              {store.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-default-900 mb-2">
            {store.name}
          </h3>
          <p className="text-sm text-default-500 mb-6">
            Store #{store.id}
          </p>
          <Button 
            color="primary" 
            variant="shadow" 
            as={Link}
            href={`/stores/${store.id}`}
            className="w-full font-semibold"
            size="lg"
          >
            View Selection
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default StoreCard;
