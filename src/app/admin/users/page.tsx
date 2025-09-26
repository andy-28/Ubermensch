"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function UserListPage() {
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/admin/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
    }, [])

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>會員管理</CardTitle>
                <Link href="/admin/users/new">
                    <Button>+ 新增會員</Button>
                </Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>驗證</TableHead>
                            <TableHead>建立時間</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500">
                                    目前沒有會員
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell>
                                        {u.isVerified ? (
                                            <span className="text-green-600 font-bold">已驗證</span>
                                        ) : (
                                            <span className="text-red-500 font-bold">未驗證</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(u.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/users/${u.id}`}>
                                            <Button variant="outline" size="sm">
                                                編輯
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
