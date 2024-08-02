import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/icons';

export function DashboardOrders() {
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-5">
      <CardHeader className="px-7">
        <CardTitle>Pending Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  olivia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-24</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Noah Williams</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  noah@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant="outline">
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-25</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Emma Brown</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  emma@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-26</TableCell>
              <TableCell className="text-right">$450.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Liam Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  liam@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge className="text-xs" variant="secondary">
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-23</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  olivia@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  className="text-xs bg-cyan-200 text-cyan-950 "
                  variant="outline"
                >
                  Open
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-24</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Emma Brown</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  emma@example.com
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  className="text-xs bg-lime-200 text-lime-950"
                  variant="outline"
                >
                  Paid
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">2023-06-26</TableCell>
              <TableCell className="text-right">$450.00</TableCell>
              <TableCell className="w-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Icons.moreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Completed</DropdownMenuItem>
                    <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
