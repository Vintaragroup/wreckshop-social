import { Card, CardContent } from "./ui/card";
import { useIsMobile } from "./ui/use-mobile";

interface MobileTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
  }[];
  children?: React.ReactNode;
}

export function MobileTable({ data, columns, children }: MobileTableProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <div className="table-container">{children}</div>;
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <Card key={item.id || index}>
          <CardContent className="mobile-compact">
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">
                    {column.label}
                  </span>
                  <span className="text-sm">
                    {column.render 
                      ? column.render(item[column.key], item)
                      : item[column.key]
                    }
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}