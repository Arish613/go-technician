"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export function AMCComparisonTable() {
    return (
        <section className="py-12 md:py-16 bg-muted/30">
            <div className="md:mx-20 px-4">
                <Card className="border-none shadow-none">
                    <CardHeader className="text-center pb-8">
                        <CardTitle className="text-3xl md:text-4xl font-bold">
                            <h2>
                                Compare AMC Plans We Offer
                            </h2> 
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="w-[40%] font-semibold text-slate-900">
                                        Plan Details
                                    </TableHead>
                                    <TableHead className="text-center font-semibold text-slate-900">
                                        Basic AMC
                                    </TableHead>
                                    <TableHead className="text-center font-semibold text-slate-900">
                                        Advanced AMC
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Coverage Period */}
                                <TableRow className="bg-blue-50/50">
                                    <TableCell className="font-medium text-primary" colSpan={3}>
                                        Coverage Period
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Coverage Period</TableCell>
                                    <TableCell className="text-center">1 year</TableCell>
                                    <TableCell className="text-center">1 year or 2 years</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Preventive Maintenance Visits</TableCell>
                                    <TableCell className="text-center">2 visits per year</TableCell>
                                    <TableCell className="text-center">2 visits per year</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Age of Air Conditioner</TableCell>
                                    <TableCell className="text-center text-sm">
                                        For ACs less than 10 years old
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        For ACs less than 5 years old
                                    </TableCell>
                                </TableRow>

                                {/* What is Covered */}
                                <TableRow className="bg-blue-50/50">
                                    <TableCell className="font-medium text-primary" colSpan={3}>
                                        What is Covered?
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Cost of Spare Parts</TableCell>
                                    <TableCell className="text-center text-sm">
                                        To be paid, as needed
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        Included (except cooling and condensor coils)
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Breakdown Support</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Gas Charging and Repairs</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Physical Damage</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-red-500 rounded-full p-1">
                                                <X className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-red-500 rounded-full p-1">
                                                <X className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="pl-8">Free Transport</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <div className="bg-green-500 rounded-full p-1">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}