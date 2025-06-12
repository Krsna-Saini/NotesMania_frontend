import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Attachment, getIconFromFileType } from "@/lib/utils";
// Map file types to icons

type Props = {
  groupedAttachments: Record<string, Attachment[]>;
};

export default function FileTypeSummaryCarousel({ groupedAttachments }: Props) {
  return (
    <Carousel className=" w-full max-w-[70vw] md:max-w-[80vw] h-fit m-2 mb-6  mx-auto">
      <CarouselContent className="ml-2">
        {Object.entries(groupedAttachments).map(([type, items]) => (
          <CarouselItem key={type} className="basis-2/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
            <Card className="rounded-2xl w-fit md:w-35 lg:w-50 shadow-md bg-muted/40 hover:shadow-lg transition-shadow">
              <CardContent className="p-2 flex flex-col items-center text-center">
                <Image
                  src={getIconFromFileType(type).image}
                  alt={`${type} icon`}
                  width={88}
                  height={88}
                  className="mb-4"
                />
                <div className="text-base font-semibold w-40 capitalize line-clamp-1">{getIconFromFileType(type).format} Files</div>
                <div className="text-muted-foreground text-sm line-clamp-1">{items.length} files</div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
