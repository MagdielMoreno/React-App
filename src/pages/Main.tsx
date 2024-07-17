import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    Input,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import { Key } from "@react-types/shared";
import React from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const BASE_URL = 'https://api-springboot-production.up.railway.app';
const columns = [
    { key: "name", label: "NAME", sortable: true },
    { key: "email", label: "EMAIL", sortable: true },
    { key: "phone", label: "PHONE", sortable: true },
    { key: "actions", label: "ACTIONS", sortable: false },
];

const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get<Student[]>(`${BASE_URL}/students`);
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students: ", error);
            }
        };

        fetchStudents();
    }, []);

    const addStudent = async (student: Student) => {
        try {
            const response = await axios.post<Student>(`${BASE_URL}/students`, student);
            setStudents(prev => [...prev, response.data]);
            console.log("Student Added");
        } catch (error) {
            console.error("Error adding student: ", error);
        }
    };

    const updateStudent = async (student: Student) => {
        try {
            const response = await axios.put<Student>(`${BASE_URL}/update/${student.id}`, student);
            setStudents(prev => prev.map(s => s.id === student.id ? response.data : s));
            console.log("Student Updated");
        } catch (error) {
            console.error("Error updating student: ", error);
        }
    };

    const deleteStudents = async (ids: number[]) => {
        try {
            await Promise.all(ids.map(id => axios.delete(`${BASE_URL}/delete/${id}`)));
            setStudents(prev => prev.filter(student => !ids.includes(student.id)));
            console.log("Student(s) Deleted");
        } catch (error) {
            console.error("Error deleting students: ", error);
        }
    };

    return { students, setStudents, addStudent, updateStudent, deleteStudents };
};

const useStudentModals = () => {
    const [editStudent, setEditStudent] = useState<Student | null>(null);
    const [toAddStudent, setAddStudent] = useState<Student | null>(null);
    const {isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose} = useDisclosure();
    const {isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose} = useDisclosure();
    const {isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose} = useDisclosure();

    return { 
        editStudent, setEditStudent,
        toAddStudent, setAddStudent,
        isEditModalOpen, onEditModalOpen, onEditModalClose, 
        isDeleteModalOpen, onDeleteModalOpen, onDeleteModalClose,
        isAddModalOpen, onAddModalOpen, onAddModalClose
    };
};

const Main = () => {
    const { students, addStudent, updateStudent, deleteStudents } = useStudents();
    const { 
        editStudent, setEditStudent, isEditModalOpen, onEditModalOpen, onEditModalClose, 
        isDeleteModalOpen, onDeleteModalOpen, onDeleteModalClose,
        toAddStudent, setAddStudent, isAddModalOpen, onAddModalOpen, onAddModalClose
    } = useStudentModals();
    const [filterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(15);
    const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());
    const [, setVisibleColumns] = useState<Set<string>>(new Set(columns.map(col => col.key)));
    const [sortDescriptor, setSortDescriptor] = useState<{ column: string, direction: 'ascending' | 'descending' }>({ column: "name", direction: "ascending" });

    const navigate = useNavigate();

    const login = () => navigate('/');

    const handleSelectionChange = (keys: "all" | Set<Key>) => {
        setSelectedKeys(keys === "all" ? new Set(students.map(student => student.id)) : new Set(keys));
    };

    const handleEditModalOpen = (student: Student) => {
        setEditStudent(student);
        onEditModalOpen();
    };

    const handleAddModalOpen = () => {
        setAddStudent(toAddStudent);
        onAddModalOpen();
    };

    const handleDelete = async () => {
        if (selectedKeys.size === 0) {
            console.log("No students selected for deletion.");
            return;
        }

        const selectedIds = Array.from(selectedKeys) as number[];
        await deleteStudents(selectedIds);
        setSelectedKeys(new Set());
        onDeleteModalClose();
    };

    const filteredStudents = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return students.filter(student => 
            student.name.toLowerCase().includes(filterValue.toLowerCase()) ||
            student.email.toLowerCase().includes(filterValue.toLowerCase()) ||
            student.phone.includes(filterValue)
        ).slice(start, end);
    }, [page, rowsPerPage, students, filterValue]);

    const sortedStudents = useMemo(() => {
        const { column, direction } = sortDescriptor;
        return [...filteredStudents].sort((a, b) => {
            const aValue = a[column as keyof Student];
            const bValue = b[column as keyof Student];
            return direction === 'ascending' ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : (bValue < aValue ? -1 : bValue > aValue ? 1 : 0);
        });
    }, [sortDescriptor, filteredStudents]);

    const handleSortChange = (columnKey: string) => {
        setSortDescriptor(prev => ({ column: columnKey, direction: prev.direction === 'ascending' ? 'descending' : 'ascending' }));
    };

    const handleEdit = async () => {
        if (editStudent) {
            await updateStudent(editStudent);
            onEditModalClose();
        }
    };
    
    const handleAdd = async () => {
        if (toAddStudent) {
            await addStudent(toAddStudent);
            onAddModalClose();
        }
    };

    const renderCell = useCallback((student: Student, columnKey: React.Key) => {
        const cellValue = student[columnKey as keyof Student];
        return columnKey === "actions" ? (
            <div className="relative flex justify-center items-center gap-2">
                <Button isIconOnly size="sm" variant="light">
                    <span onClick={() => handleEditModalOpen(student)} className="material-symbols-rounded">edit</span>
                </Button>
            </div>
        ) : cellValue;
    }, [handleEditModalOpen]);
    
    return (
        <>
            {/* Google Icons */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div className="flex flex-col gap-3">
                {/* Title */}
                <h1 className='text-2xl font-bold mb-2'>Students</h1>
                <div className='flex justify-between items-center gap-2'>
                    {/* Back Button */}
                    <span onClick={login} className="material-symbols-rounded cursor-pointer bg-onBackground p-2 rounded-full hover:opacity-85">arrow_back</span>

                    {/* Search Bar */}
                    <Input
                        isClearable
                        className="w-full input-background"
                        placeholder="Search by name, email or phone..."
                        startContent={<span className="material-symbols-rounded">search</span>}
                        value={filterValue}
                        onClear={() => setFilterValue("")}
                        radius='full'
                        onValueChange={(value) => setFilterValue(value)}
                    />

                    {/* Column Select Dropdown */}
                    <Dropdown>
                        <DropdownTrigger className='bg-onBackground'>
                            <span className="material-symbols-rounded hover:cursor-pointer p-2 rounded-full hover:opacity-85">keyboard_arrow_down</span>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={new Set(columns.map(col => col.key))}
                            selectionMode="multiple"
                            onSelectionChange={(keys) => setVisibleColumns(new Set(Array.from(keys) as string[]))}>
                            {columns.map((column) => (
                                <DropdownItem key={column.key}>{column.label}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    {/* Delete Button */}
                    <span 
                        onClick={selectedKeys.size === 0 ? undefined : onDeleteModalOpen} 
                        className={`material-symbols-rounded p-2 rounded-full ${
                            selectedKeys.size === 0 ? 'bg-onBackground cursor-not-allowed' : 'bg-danger hover:cursor-pointer hover:opacity-85'
                        }`}
                        style={{ pointerEvents: selectedKeys.size === 0 ? 'none' : 'auto' }}>
                        delete
                    </span>

                    {/* Add Button */}
                    <span onClick={() => handleAddModalOpen()} className="material-symbols-rounded text-white bg-primary p-2 rounded-full hover:cursor-pointer hover:opacity-85">add</span>
                </div>
                
                {/* Main Table */}
                <Table
                    removeWrapper
                    isCompact
                    className='bg-background p-4 rounded-2xl'
                    selectionMode="multiple"
                    selectionBehavior="toggle"
                    onSelectionChange={handleSelectionChange}>
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn
                            key={column.key}
                            align={column.key === 'actions' ? 'center' : 'start'}
                            allowsSorting={column.sortable}
                            onClick={() => column.sortable && handleSortChange(column.key)}>
                            {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={sortedStudents}>
                        {(student) => (
                            <TableRow key={student.id}>
                                {(columnKey) => <TableCell>{renderCell(student, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="py-2 px-2 flex justify-between items-center text-white">
                    {/* Pagination Component */}
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={Math.ceil(students.length / rowsPerPage)}
                        onChange={setPage}
                    />

                    {/* Selected or Total Students Text */}
                    <div className="hidden sm:flex w-[30%] justify-end">
                        {selectedKeys.size === 0 ? (
                            <span className="text-default-500 text-medium">{students.length} Students</span>
                        ) : (
                            <span className="text-default-500 text-medium">
                                {selectedKeys.size === students.length
                                    ? "All items selected"
                                    : `${selectedKeys.size} of ${students.length} selected`}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Add Student Modal */}
            <Modal 
                isOpen={isAddModalOpen} 
                backdrop='blur'
                onOpenChange={onAddModalClose}
                placement="top-center">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Add Student</ModalHeader>
                    <ModalBody>
                    <Input
                        label="Name"
                        placeholder="Name"
                        variant="bordered"
                        value={toAddStudent?.name || ''}
                        onChange={(e) => setAddStudent((prevStudent) => ({
                            ...prevStudent!,
                            name: e.target.value
                        }))} />
                    <Input
                        label="Email"
                        placeholder="Email"
                        type="email"
                        variant="bordered"
                        value={toAddStudent?.email || ''}
                        onChange={(e) => setAddStudent((prevStudent) => ({
                            ...prevStudent!,
                            email: e.target.value
                        }))} />
                    <Input
                        label="Phone"
                        placeholder="Phone"
                        type="tel"
                        variant="bordered"
                        value={toAddStudent?.phone || ''}
                        onChange={(e) => setAddStudent((prevStudent) => ({
                            ...prevStudent!,
                            phone: e.target.value
                        }))} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>
                        Cancel
                        </Button>
                        <Button color="primary" onPress={handleAdd}>
                        Add
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            {/* Edit Student Modal */}
            <Modal 
                isOpen={isEditModalOpen} 
                backdrop='blur'
                onOpenChange={onEditModalClose}
                placement="top-center">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Edit Student</ModalHeader>
                    <ModalBody>
                    <Input
                        label="Name"
                        placeholder="Name"
                        variant="bordered"
                        value={editStudent?.name || ''}
                        onChange={(e) => setEditStudent((prevStudent) => ({
                            ...prevStudent!,
                            name: e.target.value
                        }))} />
                    <Input
                        label="Email"
                        placeholder="Email"
                        type="email"
                        variant="bordered"
                        value={editStudent?.email || ''}
                        onChange={(e) => setEditStudent((prevStudent) => ({
                            ...prevStudent!,
                            email: e.target.value
                        }))} />
                    <Input
                        label="Phone"
                        placeholder="Phone"
                        type="tel"
                        variant="bordered"
                        value={editStudent?.phone || ''}
                        onChange={(e) => setEditStudent((prevStudent) => ({
                            ...prevStudent!,
                            phone: e.target.value
                        }))} />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>
                        Cancel
                        </Button>
                        <Button color="primary" onPress={handleEdit}>
                        Save
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            {/* Delete Student Modal */}
            <Modal 
                isOpen={isDeleteModalOpen} 
                backdrop='blur'
                onOpenChange={onDeleteModalClose}
                placement="top-center">
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">Delete Student</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete the selected student(s)?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>
                        Cancel
                        </Button>
                        <Button color="danger" onPress={handleDelete}>
                        Delete
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default Main;