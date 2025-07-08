import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding...');

  // --- Usuários ---
  const hashedPassword1 = await bcrypt.hash('SenhaSegura123', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'joao.silva@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      password: hashedPassword1,
    },
  });

  const hashedPassword2 = await bcrypt.hash('MariaSouza456', 10); // Changed for consistency, optional
  const user2 = await prisma.user.upsert({
    where: { email: 'maria.souza@example.com' },
    update: {},
    create: {
      name: 'Maria Souza',
      email: 'maria.souza@example.com',
      password: hashedPassword2,
    },
  });

  console.log('Usuários criados:', { user1, user2 });

  // --- Métodos de Pagamento ---
  const paymentMethod1 = await prisma.paymentMethod.upsert({
    where: { paymentMethodName: 'Cartão de Crédito' },
    update: {},
    create: {
      paymentMethodName: 'Cartão de Crédito',
      paymentMethodType: 'Crédito',
    },
  });

  const paymentMethod2 = await prisma.paymentMethod.upsert({
    where: { paymentMethodName: 'Débito' },
    update: {},
    create: {
      paymentMethodName: 'Débito',
      paymentMethodType: 'Débito',
    },
  });

  const paymentMethod3 = await prisma.paymentMethod.upsert({
    where: { paymentMethodName: 'Dinheiro' },
    update: {},
    create: {
      paymentMethodName: 'Dinheiro',
      paymentMethodType: 'Dinheiro',
    },
  });

  const paymentMethod4 = await prisma.paymentMethod.upsert({
    where: { paymentMethodName: 'Pix' },
    update: {},
    create: {
      paymentMethodName: 'Pix',
      paymentMethodType: 'Transferência',
    },
  });

  console.log('Métodos de pagamento criados:', { paymentMethod1, paymentMethod2, paymentMethod3, paymentMethod4 });

  // --- Locais de Compra ---
  const location1 = await prisma.purchaseLocation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      locationName: 'Supermercado Bom Preço',
      locationType: 'Supermercado',
      address: 'Rua das Flores, 123, Centro',
    },
  });

  const location2 = await prisma.purchaseLocation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      locationName: 'Farmácia Sempre Viva',
      locationType: 'Farmácia',
      address: 'Avenida Principal, 456, Bairro Novo',
    },
  });

  const location3 = await prisma.purchaseLocation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      locationName: 'Loja de Eletrônicos Tech Tudo',
      locationType: 'Loja',
      address: 'Shopping Center, Loja 10, Vila Rica',
    },
  });

  console.log('Locais de compra criados:', { location1, location2, location3 });

  // --- Categorias ---
  const category1 = await prisma.category.upsert({
    where: { categoryName: 'Alimentação' },
    update: {},
    create: {
      categoryName: 'Alimentação',
      description: 'Gastos com comida e bebidas.',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { categoryName: 'Saúde' },
    update: {},
    create: {
      categoryName: 'Saúde',
      description: 'Gastos com medicamentos, consultas e exames.',
    },
  });

  const category3 = await prisma.category.upsert({
    where: { categoryName: 'Transporte' },
    update: {},
    create: {
      categoryName: 'Transporte',
      description: 'Gastos com combustível, passagens e manutenção de veículo.',
    },
  });

  const category4 = await prisma.category.upsert({
    where: { categoryName: 'Educação' },
    update: {},
    create: {
      categoryName: 'Educação',
      description: 'Gastos com mensalidades, livros e cursos.',
    },
  });

  console.log('Categorias criadas:', { category1, category2, category3, category4 });

  // --- Compras ---
  const purchase1 = await prisma.purchase.upsert({
    where: { id: 1 },
    update: {},
    create: {
      purchaseDate: new Date('2025-06-01T10:00:00Z'),
      totalValue: 150.75,
      description: 'Compras de supermercado para o mês.',
      userId: user1.id,
      purchaseLocationId: location1.id,
    },
  });

  const purchase2 = await prisma.purchase.upsert({
    where: { id: 2 },
    update: {},
    create: {
      purchaseDate: new Date('2025-06-05T15:30:00Z'),
      totalValue: 75.00,
      description: 'Compra de medicamentos na farmácia.',
      userId: user2.id,
      purchaseLocationId: location2.id,
    },
  });

  const purchase3 = await prisma.purchase.upsert({
    where: { id: 3 },
    update: {},
    create: {
      purchaseDate: new Date('2025-06-10T11:00:00Z'),
      totalValue: 1200.00,
      description: 'Notebook novo para trabalho.',
      userId: user1.id,
      purchaseLocationId: location3.id,
    },
  });

  console.log('Compras criadas:', { purchase1, purchase2, purchase3 });

  // Log IDs for debugging
  console.log('Debugging IDs for expenses:');
  console.log(`  user1.id: ${user1.id}`);
  console.log(`  user2.id: ${user2.id}`);
  console.log(`  category1.id: ${category1.id}`);
  console.log(`  category2.id: ${category2.id}`);
  console.log(`  category3.id: ${category3.id}`);
  console.log(`  category4.id: ${category4.id}`);
  console.log(`  purchase1.id: ${purchase1.id}`);
  console.log(`  purchase2.id: ${purchase2.id}`);
  console.log(`  purchase3.id: ${purchase3.id}`);

  // --- Despesas ---
  const expense1 = await prisma.expense.upsert({
    where: { id: 1 },
    update: {},
    create: {
      value: 50.25,
      expenseDate: new Date('2025-06-01T10:15:00Z'),
      description: 'Arroz e feijão.',
      expenseType: 'Alimentos',
      purchaseId: purchase1.id,
      categoryId: category1.id,
      userId: user1.id,
    },
  });

  const expense2 = await prisma.expense.upsert({
    where: { id: 2 },
    update: {},
    create: {
      value: 25.00,
      expenseDate: new Date('2025-06-01T10:30:00Z'),
      description: 'Frutas e verduras.',
      expenseType: 'Alimentos',
      purchaseId: purchase1.id,
      categoryId: category1.id,
      userId: user1.id,
    },
  });

  const expense3 = await prisma.expense.upsert({
    where: { id: 3 },
    update: {},
    create: {
      value: 75.00,
      expenseDate: new Date('2025-06-05T15:45:00Z'),
      description: 'Remédio para dor de cabeça.',
      expenseType: 'Medicamento',
      purchaseId: purchase2.id,
      categoryId: category2.id,
      userId: user2.id,
    },
  });

  const expense4 = await prisma.expense.upsert({
    where: { id: 4 },
    update: {},
    create: {
      value: 1200.00,
      expenseDate: new Date('2025-06-10T11:15:00Z'),
      description: 'Notebook Dell Inspiron.',
      expenseType: 'Eletrônico',
      purchaseId: purchase3.id,
      categoryId: category4.id,
      userId: user1.id,
    },
  });

  console.log('Despesas criadas:', { expense1, expense2, expense3, expense4 });

  // --- Métodos de Pagamento da Compra ---
  const purchasePaymentMethod1 = await prisma.purchasePaymentMethod.upsert({
    where: { id: 1 },
    update: {},
    create: {
      paidValue: 150.75,
      purchaseId: purchase1.id,
      paymentMethodId: paymentMethod1.id,
    },
  });

  const purchasePaymentMethod2 = await prisma.purchasePaymentMethod.upsert({
    where: { id: 2 },
    update: {},
    create: {
      paidValue: 75.00,
      purchaseId: purchase2.id,
      paymentMethodId: paymentMethod3.id,
    },
  });

  const purchasePaymentMethod3 = await prisma.purchasePaymentMethod.upsert({
    where: { id: 3 },
    update: {},
    create: {
      paidValue: 1200.00,
      purchaseId: purchase3.id,
      paymentMethodId: paymentMethod2.id,
    },
  });

  console.log('Métodos de pagamento de compra criados:', { purchasePaymentMethod1, purchasePaymentMethod2, purchasePaymentMethod3 });

  console.log('Seeding concluído!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });