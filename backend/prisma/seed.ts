import { PrismaClient, UserRole, QuotationStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import 'dotenv/config';

function resolvePgSslConfig() {
  const certPath = process.env.PGSSLROOTCERT?.trim();
  const certPem = process.env.PGSSLROOTCERT_PEM?.trim();
  const certBase64 = process.env.PGSSLROOTCERT_BASE64?.trim();

  let ca: string | undefined;

  if (certPem) {
    ca = certPem;
  } else if (certBase64) {
    ca = Buffer.from(certBase64, 'base64').toString('utf8');
  } else if (certPath) {
    ca = fs.readFileSync(certPath, 'utf8');
  }

  if (!ca) {
    return undefined;
  }

  return {
    ca,
    rejectUnauthorized: true,
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: resolvePgSslConfig(),
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes
  console.log('🗑️  Cleaning existing data...');
  await prisma.quotation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.companySettings.deleteMany();
  await prisma.additionalService.deleteMany();

  // 1. Crear configuración de la empresa
  console.log('🏢 Creating company settings...');
  await prisma.companySettings.create({
    data: {
      companyName: 'BarmenTech Seguros',
      legalId: '3-101-123456',
      email: 'contacto@barmentech.com',
      website: 'https://barmentech.com',
      businessAddress: 'San José, Costa Rica',
      legalRepName: 'Allan Barmen',
      legalRepId: '1-1234-5678',
      phoneNumbers: [
        { country: 'Costa Rica', phone: '+506 8888-8888' },
        { country: 'USA', phone: '+1 (555) 123-4567' },
        { country: 'México', phone: '+52 55 1234 5678' },
      ],
      socialMedia: {
        facebook: 'https://facebook.com/barmentech',
        instagram: 'https://instagram.com/barmentech',
        whatsapp: '+506 8888-8888',
      },
      logoUrl: null, // Se debe subir desde el frontend
      signatureUrl: null, // Se debe subir desde el frontend
    },
  });
  console.log('✅ Company settings created');

  // 2. Crear usuarios de prueba
  console.log('👥 Creating users...');

  // Admin user - Nota: Admin123! cumple con la política de contraseñas fuertes
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@barmentech.com',
      password: adminPassword,
      fullName: 'Allan Barmen - Admin',
      phone: '+506 8888-8888',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created: admin@barmentech.com / Admin123!');

  // Agent user
  const agentPassword = await bcrypt.hash('Admin123!', 10);
  const agent = await prisma.user.create({
    data: {
      email: 'agente@barmentech.com',
      password: agentPassword,
      fullName: 'Carlos Rodríguez - Agente',
      phone: '+506 7777-7777',
      role: UserRole.AGENT,
      isActive: true,
    },
  });
  console.log('✅ Agent user created: agente@barmentech.com / Admin123!');

  // Client users para pruebas
  const clientPassword = await bcrypt.hash('Admin123!', 10);
  const client1 = await prisma.user.create({
    data: {
      email: 'cliente1@example.com',
      password: clientPassword,
      fullName: 'María González',
      phone: '+506 6666-6666',
      role: UserRole.CLIENT,
      isActive: true,
    },
  });
  console.log('✅ Client 1 created: cliente1@example.com / Admin123!');

  const client2 = await prisma.user.create({
    data: {
      email: 'cliente2@example.com',
      password: clientPassword,
      fullName: 'Pedro Martínez',
      phone: '+506 5555-5555',
      role: UserRole.CLIENT,
      isActive: true,
    },
  });
  console.log('✅ Client 2 created: cliente2@example.com / Admin123!');

  // 3. Crear cotizaciones de ejemplo
  console.log('📋 Creating sample quotations...');

  // Cotización 1 - Cliente 1, creada por admin
  await prisma.quotation.create({
    data: {
      clientId: client1.id,
      createdById: admin.id,
      clientName: client1.fullName,
      clientEmail: client1.email,
      clientPhone: client1.phone,
      destination: 'Europa - Francia, España, Italia',
      travelDateFrom: new Date('2026-07-15'),
      travelDateTo: new Date('2026-07-30'),
      consecutiveDays: '15 días',
      globalMaxAmount: 'USD 60,000',
      validityTerritory: 'Europa',
      coverages: [
        {
          name: 'Gastos Médicos',
          coverage: 'USD 60,000',
          description: 'Cobertura médica completa en el extranjero',
        },
        {
          name: 'Equipaje',
          coverage: 'USD 1,200',
          description: 'Pérdida, robo o daño de equipaje',
        },
        {
          name: 'Cancelación de Viaje',
          coverage: 'USD 5,000',
          description: 'Reembolso por cancelación justificada',
        },
        {
          name: 'Asistencia Legal',
          coverage: 'USD 2,000',
          description: 'Asesoría legal en el destino',
        },
      ],
      status: QuotationStatus.SENT,
      notes: 'Viaje familiar de verano a Europa. 2 adultos.',
      pdfUrl: null,
      originalPdfUrl: null,
    },
  });
  console.log('✅ Quotation 1 created (SENT)');

  // Cotización 2 - Cliente 2, creada por agente
  await prisma.quotation.create({
    data: {
      clientId: client2.id,
      createdById: agent.id,
      clientName: client2.fullName,
      clientEmail: client2.email,
      clientPhone: client2.phone,
      destination: 'América del Norte - Estados Unidos',
      travelDateFrom: new Date('2026-08-10'),
      travelDateTo: new Date('2026-08-20'),
      consecutiveDays: '10 días',
      globalMaxAmount: 'USD 100,000',
      validityTerritory: 'América del Norte',
      coverages: [
        {
          name: 'Gastos Médicos',
          coverage: 'USD 100,000',
          description: 'Cobertura médica premium',
        },
        {
          name: 'Equipaje',
          coverage: 'USD 2,000',
          description: 'Pérdida, robo o daño de equipaje',
        },
        {
          name: 'Repatriación',
          coverage: 'Ilimitado',
          description: 'Repatriación sanitaria o de restos',
        },
        {
          name: 'COVID-19',
          coverage: 'USD 100,000',
          description: 'Cobertura específica para COVID-19',
        },
      ],
      status: QuotationStatus.ACCEPTED,
      notes:
        'Viaje de negocios a Nueva York. Plan premium con cobertura COVID.',
      pdfUrl: null,
      originalPdfUrl: null,
    },
  });
  console.log('✅ Quotation 2 created (ACCEPTED)');

  // Cotización 3 - Sin cliente (cotización rápida), creada por admin
  await prisma.quotation.create({
    data: {
      clientId: null,
      createdById: admin.id,
      clientName: 'Juan Pérez',
      clientEmail: 'juan.perez@example.com',
      clientPhone: '+506 4444-4444',
      destination: 'América del Sur - Brasil, Argentina',
      travelDateFrom: new Date('2026-09-05'),
      travelDateTo: new Date('2026-09-19'),
      consecutiveDays: '14 días',
      globalMaxAmount: 'USD 50,000',
      validityTerritory: 'América del Sur',
      coverages: [
        {
          name: 'Gastos Médicos',
          coverage: 'USD 50,000',
          description: 'Cobertura médica estándar',
        },
        {
          name: 'Equipaje',
          coverage: 'USD 1,000',
          description: 'Pérdida, robo o daño de equipaje',
        },
        {
          name: 'Demora de Vuelo',
          coverage: 'USD 500',
          description: 'Compensación por demora mayor a 6 horas',
        },
      ],
      status: QuotationStatus.DRAFT,
      notes:
        'Cotización pendiente de confirmación. Grupo familiar de 4 personas.',
      pdfUrl: null,
      originalPdfUrl: null,
    },
  });
  console.log('✅ Quotation 3 created (DRAFT)');

  // 4. Crear servicios adicionales de ejemplo
  console.log('🛡️  Creating additional services...');

  await prisma.additionalService.create({
    data: {
      name: 'Equipaje Protegido Plus',
      slug: 'equipaje-protegido-plus',
      category: 'equipaje',
      shortDescription:
        'Protección adicional para pérdida, robo o daño de equipaje',
      fullDescription:
        'Cobertura extendida que protege tu equipaje contra pérdida, robo, daño o demora. Incluye asistencia 24/7 para rastreo y reembolso inmediato.',
      basePrice: 25,
      pricingType: 'per_trip',
      coverageLevels: [
        {
          name: 'Básico',
          price: 25,
          coverage: 'USD 1,500',
          description: 'Cobertura estándar para equipaje',
        },
        {
          name: 'Estándar',
          price: 45,
          coverage: 'USD 3,000',
          description: 'Cobertura mejorada + demora',
        },
        {
          name: 'Premium',
          price: 75,
          coverage: 'USD 5,000',
          description: 'Cobertura máxima + artículos de valor',
        },
      ],
      features: [
        'Pérdida o robo de equipaje',
        'Daños durante el transporte',
        'Demora de equipaje (>12 horas)',
        'Asistencia 24/7 para rastreo',
        'Reembolso de gastos de emergencia',
      ],
      isActive: true,
      displayOrder: 1,
    },
  });
  console.log('✅ Service 1 created: Equipaje Protegido Plus');

  await prisma.additionalService.create({
    data: {
      name: 'Cobertura COVID-19 Extra',
      slug: 'cobertura-covid-19-extra',
      category: 'salud',
      shortDescription: 'Protección completa ante COVID-19 durante tu viaje',
      fullDescription:
        'Cobertura especializada para gastos médicos relacionados con COVID-19, incluyendo pruebas, tratamiento, hospitalización, cuarentena obligatoria y cancelación de viaje por positivo.',
      basePrice: 35,
      pricingType: 'per_trip',
      coverageLevels: [
        {
          name: 'Básico',
          price: 35,
          coverage: 'USD 30,000',
          description: 'Gastos médicos COVID-19',
        },
        {
          name: 'Completo',
          price: 65,
          coverage: 'USD 100,000',
          description: 'Médicos + cuarentena + cancelación',
        },
      ],
      features: [
        'Gastos médicos por COVID-19',
        'Pruebas PCR o antígeno requeridas',
        'Hospitalización y tratamiento',
        'Cuarentena obligatoria (hotel)',
        'Cancelación por positivo pre-viaje',
        'Extensión de estadía',
      ],
      isActive: true,
      displayOrder: 2,
    },
  });
  console.log('✅ Service 2 created: Cobertura COVID-19 Extra');

  await prisma.additionalService.create({
    data: {
      name: 'Deportes de Aventura',
      slug: 'deportes-aventura',
      category: 'deportes',
      shortDescription: 'Cobertura para actividades deportivas extremas',
      fullDescription:
        'Protección especializada para practicantes de deportes de aventura y actividades extremas. Incluye esquí, snowboard, buceo, surf, paracaidismo, escalada y más.',
      basePrice: 50,
      pricingType: 'per_trip',
      coverageLevels: [
        {
          name: 'Básico',
          price: 50,
          coverage: 'USD 25,000',
          description: 'Deportes recreativos',
        },
        {
          name: 'Extremo',
          price: 95,
          coverage: 'USD 75,000',
          description: 'Deportes extremos + evacuación',
        },
      ],
      features: [
        'Esquí y snowboard',
        'Buceo hasta 30 metros',
        'Surf y deportes acuáticos',
        'Escalada y trekking',
        'Paracaidismo (con instructor)',
        'Evacuación de emergencia',
      ],
      isActive: true,
      displayOrder: 3,
    },
  });
  console.log('✅ Service 3 created: Deportes de Aventura');

  await prisma.additionalService.create({
    data: {
      name: 'Protección Embarazo',
      slug: 'proteccion-embarazo',
      category: 'salud',
      shortDescription: 'Cobertura médica para mujeres embarazadas',
      fullDescription:
        'Protección especializada para viajeras embarazadas hasta la semana 32. Cubre complicaciones del embarazo, parto prematuro y atención neonatal de emergencia.',
      basePrice: 85,
      pricingType: 'per_trip',
      coverageLevels: [
        {
          name: 'Estándar',
          price: 85,
          coverage: 'USD 50,000',
          description: 'Hasta semana 28',
        },
        {
          name: 'Premium',
          price: 150,
          coverage: 'USD 150,000',
          description: 'Hasta semana 32 + neonatal',
        },
      ],
      features: [
        'Complicaciones del embarazo',
        'Parto prematuro de emergencia',
        'Atención neonatal básica',
        'Consultas de emergencia',
        'Medicamentos relacionados',
        'Repatriación sanitaria (madre y bebé)',
      ],
      isActive: true,
      displayOrder: 4,
    },
  });
  console.log('✅ Service 4 created: Protección Embarazo');

  await prisma.additionalService.create({
    data: {
      name: 'Cancelación de Viaje Premium',
      slug: 'cancelacion-viaje-premium',
      category: 'viaje',
      shortDescription: 'Reembolso completo por cancelación justificada',
      fullDescription:
        'Protección integral que te reembolsa los gastos no reembolsables de tu viaje si debes cancelar por causas justificadas: enfermedad, accidente, problemas laborales, desastres naturales, etc.',
      basePrice: 60,
      pricingType: 'percentage',
      coverageLevels: [
        {
          name: '5% del viaje',
          price: 0,
          coverage: 'Hasta USD 5,000',
          description: 'Cobertura 5% del costo total',
        },
        {
          name: '7% del viaje',
          price: 0,
          coverage: 'Hasta USD 10,000',
          description: 'Cobertura 7% del costo total',
        },
      ],
      features: [
        'Cancelación por enfermedad',
        'Accidente grave (tú o familiar)',
        'Problemas laborales inesperados',
        'Desastres naturales en destino',
        'Citaciones judiciales',
        'Reembolso de vuelos, hoteles, tours',
      ],
      isActive: true,
      displayOrder: 5,
    },
  });
  console.log('✅ Service 5 created: Cancelación de Viaje Premium');

  await prisma.additionalService.create({
    data: {
      name: 'Tech Protection',
      slug: 'tech-protection',
      category: 'tecnologia',
      shortDescription: 'Protección para dispositivos electrónicos',
      fullDescription:
        'Cobertura especializada para tus dispositivos electrónicos durante el viaje: laptop, tablet, smartphone, cámara. Incluye robo, daño accidental y pérdida.',
      basePrice: 40,
      pricingType: 'per_trip',
      coverageLevels: [
        {
          name: 'Básico',
          price: 40,
          coverage: 'USD 1,500',
          description: '1-2 dispositivos',
        },
        {
          name: 'Premium',
          price: 70,
          coverage: 'USD 3,500',
          description: 'Hasta 4 dispositivos',
        },
      ],
      features: [
        'Robo de dispositivos',
        'Daño accidental',
        'Pérdida durante el viaje',
        'Laptop, tablet, smartphone',
        'Cámaras y drones',
        'Reembolso o reposición',
      ],
      isActive: true,
      displayOrder: 6,
    },
  });
  console.log('✅ Service 6 created: Tech Protection');

  await prisma.additionalService.create({
    data: {
      name: 'Mascota Protegida',
      slug: 'mascota-protegida',
      category: 'mascotas',
      shortDescription: 'Cobertura médica y asistencia para tu mascota',
      fullDescription:
        'Protección para tu perro o gato que viaja contigo. Incluye gastos veterinarios de emergencia, pérdida durante el viaje, cuarentena obligatoria y repatriación.',
      basePrice: 55,
      pricingType: 'per_trip',
      coverageLevels: [
        {
          name: 'Estándar',
          price: 55,
          coverage: 'USD 2,000',
          description: '1 mascota',
        },
        {
          name: 'Premium',
          price: 95,
          coverage: 'USD 5,000',
          description: 'Hasta 2 mascotas + repatriación',
        },
      ],
      features: [
        'Gastos veterinarios de emergencia',
        'Pérdida o robo de mascota',
        'Búsqueda y rastreo',
        'Cuarentena obligatoria',
        'Repatriación de mascota',
        'Asistencia telefónica 24/7',
      ],
      isActive: true,
      displayOrder: 7,
    },
  });
  console.log('✅ Service 7 created: Mascota Protegida');

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Company settings: 1`);
  console.log(`   - Users created: 4 (1 admin, 1 agent, 2 clients)`);
  console.log(`   - Quotations created: 3`);
  console.log(`   - Additional services: 7`);
  console.log('\n🔑 Login credentials:');
  console.log('   Admin:  admin@barmentech.com / Admin123!');
  console.log('   Agent:  agente@barmentech.com / Admin123!');
  console.log('   Client: cliente1@example.com / Admin123!');
  console.log('   Client: cliente2@example.com / Admin123!');
  console.log(
    '\n⚠️  Note: Password complies with strong policy (8+ chars, uppercase, lowercase, number, special char)',
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
