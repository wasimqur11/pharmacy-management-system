export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  PHARMACIST = 'pharmacist',
  ADMIN = 'admin',
  PARTNER = 'partner'
}

export interface Patient extends User {
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
}

export interface Doctor extends User {
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
  availableSlots?: TimeSlot[];
}

export interface Staff extends User {
  employeeId: string;
  department: string;
  salary: number;
  hireDate: Date;
}

export interface Partner extends User {
  profitSharePercentage: number;
  investmentAmount: number;
  joinDate: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string;
  manufacturer: string;
  batchNumber?: string;
  expiryDate?: Date;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Distributor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  currentBalance: number;
  settlementPercentage: number;
  settlementDay: number; // Day of week for settlement (1-7)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  duration: number; // in minutes
  fee: number;
  status: ConsultationStatus;
  notes?: string;
  prescriptions?: Prescription[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ConsultationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Prescription {
  id: string;
  consultationId: string;
  productId: string;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Sale {
  id: string;
  patientId?: string;
  staffId: string;
  totalAmount: number;
  discount: number;
  tax: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  items: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  UPI = 'upi',
  CREDIT = 'credit'
}

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface Purchase {
  id: string;
  distributorId: string;
  totalAmount: number;
  status: PurchaseStatus;
  items: PurchaseItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export enum PurchaseStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  PAID = 'paid'
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: Date;
  createdBy: string;
  approvedBy?: string;
  status: ExpenseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExpenseCategory {
  SALARY = 'salary',
  UTILITIES = 'utilities',
  RENT = 'rent',
  EQUIPMENT = 'equipment',
  SUPPLIES = 'supplies',
  MARKETING = 'marketing',
  OTHER = 'other'
}

export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected'
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}