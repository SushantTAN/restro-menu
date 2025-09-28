import { Button } from '@/components/ui/button';

export interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface DataTableProps<T extends { _id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

const DataTable = <T extends { _id: string }>({ columns, data, onEdit, onDelete }: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id}>
              {columns.map((column) => (
                <td key={String(column.accessor)} className="px-6 py-4 whitespace-nowrap">
                  {String(item[column.accessor])}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => onEdit(item)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(item._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
