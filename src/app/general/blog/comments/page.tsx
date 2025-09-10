import { blog_comments_columns, type BlogComment } from '@/components/TableHelper/blog_comments_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import TableListToolbar from '@/components/TableHelper/TableListToolbar'

async function getBlogComments(): Promise<BlogComment[]> {
  // Mocked data sample; replace with API call later
  return [
    {
      serial: '1',
      blog: 'Guptodhan.com: How to use it and what are the benefits?',
      name: 'John Doe',
      email: 'john.doe@example.com',
      comment: 'This article was very helpful. Thanks for sharing these tips! 👍',
      reply_from_admin: '',
      status: 'Pending',
    },
    {
      serial: '2',
      blog: 'Guptodhan.com: How to use it and what are the benefits?',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      comment: 'Could you please elaborate more on the setup process?',
      reply_from_admin: '',
      status: 'Pending',
    },
    {
      serial: '3',
      blog: 'Guptodhan.com: How to use it and what are the benefits?',
      name: 'Alex Carter',
      email: 'alex.carter@example.com',
      comment: 'I tried this and it worked great for me. Appreciate the guidance!',
      reply_from_admin: '',
      status: 'Pending',
    },
  ]
}

export default async function BlogCommentsPage() {
  const comments = await getBlogComments()

  return (
    <div className="m-5 p-5 border">
      <TableListToolbar
        title="Blog Comments"
        pageSizeOptions={[10, 20, 50]}
        pageSize={10}
      />
      <div className="mt-4">
        <DataTable columns={blog_comments_columns} data={comments} />
      </div>
    </div>
  )
}
