import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
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

type CoverageLevel = {
  name: string;
  price: number;
  coverage: string;
  description: string;
};

type ServiceSeed = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  basePrice: number;
  pricingType: 'per_trip' | 'per_day';
  coverageLevels: CoverageLevel[];
  features: string[];
  displayOrder: number;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: resolvePgSslConfig(),
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const services: ServiceSeed[] = [
  {
    name: 'Accidente 24 Horas e Invalidez Total y Permanente',
    slug: 'accidente-24-horas-invalidez-total-permanente',
    category: 'salud',
    shortDescription:
      'Cobertura por muerte accidental e invalidez total y permanente durante el viaje.',
    fullDescription:
      'Servicio adicional con dos modalidades de cobertura por accidente: muerte accidental e invalidez total y permanente. Edad elegible de 18 a 74 anos inclusive.',
    basePrice: 10,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Muerte accidental USD 50,000',
        price: 14.69,
        coverage: 'USD 50,000',
        description: 'Tarifa x TAC para muerte unicamente por accidente.',
      },
      {
        name: 'Muerte accidental USD 100,000',
        price: 25.99,
        coverage: 'USD 100,000',
        description: 'Tarifa x TAC para muerte unicamente por accidente.',
      },
      {
        name: 'Muerte accidental USD 150,000',
        price: 37.29,
        coverage: 'USD 150,000',
        description: 'Tarifa x TAC para muerte unicamente por accidente.',
      },
      {
        name: 'Muerte accidental USD 200,000',
        price: 48.59,
        coverage: 'USD 200,000',
        description: 'Tarifa x TAC para muerte unicamente por accidente.',
      },
      {
        name: 'Invalidez total USD 50,000',
        price: 11.3,
        coverage: 'USD 50,000',
        description:
          'Tarifa x TAC por invalidez total y permanente por accidente.',
      },
      {
        name: 'Invalidez total USD 100,000',
        price: 16.95,
        coverage: 'USD 100,000',
        description:
          'Tarifa x TAC por invalidez total y permanente por accidente.',
      },
      {
        name: 'Invalidez total USD 150,000',
        price: 22.6,
        coverage: 'USD 150,000',
        description:
          'Tarifa x TAC por invalidez total y permanente por accidente.',
      },
      {
        name: 'Invalidez total USD 200,000',
        price: 29.38,
        coverage: 'USD 200,000',
        description:
          'Tarifa x TAC por invalidez total y permanente por accidente.',
      },
      {
        name: 'Invalidez total USD 250,000',
        price: 32.77,
        coverage: 'USD 250,000',
        description:
          'Tarifa x TAC por invalidez total y permanente por accidente.',
      },
    ],
    features: [
      'Desde USD 10 por viaje',
      'Edad 18 a 74 anos inclusive',
      'Responsabilidad maxima por evento multiple: USD 2,500,000',
      'Aplica restricciones',
    ],
    displayOrder: 1,
  },
  {
    name: 'Servicio de Asistencia para Mascotas',
    slug: 'servicio-asistencia-mascotas',
    category: 'mascotas',
    shortDescription:
      'Asistencia veterinaria de emergencia para perro o gato durante el viaje.',
    fullDescription:
      'Cuando viajas con tu mascota, Assist Card reintegra gastos veterinarios de emergencia e internacion, y contempla compensaciones por robo o fallecimiento.',
    basePrice: 2.26,
    pricingType: 'per_day',
    coverageLevels: [
      {
        name: 'Daily',
        price: 2.26,
        coverage: 'Hasta USD 1,000',
        description:
          'Tarifa diaria. Reembolso de atencion veterinaria y medicamentos en internacion.',
      },
      {
        name: 'LSD / LSA / MT',
        price: 90.4,
        coverage: 'Hasta USD 1,000',
        description:
          'Tarifa x TAC para modalidades de larga estadia y multitrip.',
      },
    ],
    features: [
      'Reembolso por atencion veterinaria: USD 1,000',
      'Reembolso por medicamentos en internacion: USD 1,000',
      'Compensacion por robo o fallecimiento: USD 500',
      'Compensacion por danos causados por la mascota: USD 700',
    ],
    displayOrder: 2,
  },
  {
    name: 'Asistencia Medica por Enfermedades Preexistentes o Cronicas',
    slug: 'asistencia-medica-preexistentes-cronicas',
    category: 'salud',
    shortDescription:
      'Cobertura ante urgencias por complicaciones de condiciones preexistentes durante el viaje.',
    fullDescription:
      'Cubre urgencias por enfermedades preexistentes o cronicas. No aplica para atenciones programadas, tratamientos continuos, chequeos o controles.',
    basePrice: 56.5,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'AC60',
        price: 56.5,
        coverage: 'USD 60,000',
        description: 'Cobertura para plan AC60.',
      },
      {
        name: 'AC150',
        price: 56.5,
        coverage: 'USD 150,000',
        description: 'Cobertura para plan AC150.',
      },
      {
        name: 'AC250',
        price: 56.5,
        coverage: 'USD 250,000',
        description: 'Cobertura para plan AC250.',
      },
      {
        name: 'AC1M / AC3M',
        price: 56.5,
        coverage: 'USD 300,000',
        description: 'Cobertura para planes AC1M y AC3M.',
      },
    ],
    features: [
      'Tarifa por tarjeta: USD 56.50',
      '50% de recargo desde los 70 anos',
      'Disponible hasta 60 dias y anuales multiviaje',
      'Limite maximo de edad: 85 anos',
    ],
    displayOrder: 3,
  },
  {
    name: 'Garantia de Cancelacion e Interrupcion de Viaje',
    slug: 'garantia-cancelacion-interrupcion-viaje',
    category: 'viaje',
    shortDescription:
      'Reembolso de penalidades y gastos anticipados no recuperables por cancelacion o interrupcion.',
    fullDescription:
      'Assist Card reembolsa gastos pagados por anticipado en casos cubiertos como enfermedad, fallecimiento, cancelacion de boda, despido, entre otros.',
    basePrice: 16.95,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Cobertura USD 500',
        price: 16.95,
        coverage: 'USD 500',
        description: 'Tarifa x TAC.',
      },
      {
        name: 'Cobertura USD 1,000',
        price: 33.9,
        coverage: 'USD 1,000',
        description: 'Tarifa x TAC.',
      },
      {
        name: 'Cobertura USD 2,000',
        price: 67.8,
        coverage: 'USD 2,000',
        description: 'Tarifa x TAC.',
      },
      {
        name: 'Cobertura USD 3,000',
        price: 101.7,
        coverage: 'USD 3,000',
        description: 'Tarifa x TAC.',
      },
      {
        name: 'Cobertura USD 4,000',
        price: 135.6,
        coverage: 'USD 4,000',
        description: 'Tarifa x TAC.',
      },
      {
        name: 'Cobertura USD 5,000',
        price: 169.5,
        coverage: 'USD 5,000',
        description: 'Tarifa x TAC.',
      },
    ],
    features: [
      'Hasta 85 anos inclusive',
      'No aplica a productos receptivos',
      'Valido para todas las modalidades',
      'Aplica restricciones',
    ],
    displayOrder: 4,
  },
  {
    name: 'Compra Protegida',
    slug: 'compra-protegida',
    category: 'compras',
    shortDescription:
      'Protege compras realizadas durante el viaje ante robo o danos accidentales.',
    fullDescription:
      'Incluye tecnologia, joyas, ropa, juguetes y mas, siempre que las compras se paguen con tarjeta de credito durante la vigencia del producto.',
    basePrice: 5.65,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Cobertura USD 500',
        price: 5.65,
        coverage: 'USD 500',
        description: 'Tarifa por tarjeta (Daily/LSD/LSA/MT).',
      },
      {
        name: 'Cobertura USD 1,000',
        price: 11.3,
        coverage: 'USD 1,000',
        description: 'Tarifa por tarjeta (Daily/LSD/LSA/MT).',
      },
      {
        name: 'Cobertura USD 1,500',
        price: 16.95,
        coverage: 'USD 1,500',
        description: 'Tarifa por tarjeta (Daily/LSD/LSA/MT).',
      },
      {
        name: 'Cobertura USD 2,000',
        price: 22.6,
        coverage: 'USD 2,000',
        description: 'Tarifa por tarjeta (Daily/LSD/LSA/MT).',
      },
      {
        name: 'Cobertura USD 2,500',
        price: 28.25,
        coverage: 'USD 2,500',
        description: 'Tarifa por tarjeta (Daily/LSD/LSA/MT).',
      },
    ],
    features: ['Sin limite de edad', 'Aplica restricciones'],
    displayOrder: 5,
  },
  {
    name: 'COVID Extra',
    slug: 'covid-extra',
    category: 'salud',
    shortDescription:
      'Proteccion ante imprevistos no medicos por diagnostico positivo de COVID-19 durante el viaje.',
    fullDescription:
      'Incluye cancelacion/interrupcion, alimentacion y alojamiento por cuarentena, diferencia de tarifa de regreso, traslado y estancia de un familiar.',
    basePrice: 56.5,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Plan USD 1,500',
        price: 56.5,
        coverage: 'USD 1,500',
        description:
          'Tarifa por tarjeta. Incluye maximo global de evento multiple de USD 10,000.',
      },
      {
        name: 'Plan USD 3,000',
        price: 79.1,
        coverage: 'USD 3,000',
        description:
          'Tarifa por tarjeta. Incluye maximo global de evento multiple de USD 20,000.',
      },
    ],
    features: [
      'Reembolso de alimentacion/alojamiento por aislamiento',
      'Diferencia de tarifa por regreso retrasado o anticipado',
      'Traslado y estancia de familiar',
      'Aplica restricciones',
    ],
    displayOrder: 6,
  },
  {
    name: 'Deportes',
    slug: 'deportes',
    category: 'deportes',
    shortDescription:
      'Cobertura para entrenamientos, practicas, competencias o exhibiciones.',
    fullDescription:
      'Aplica para amateur o profesional, incluidos deportes invernales y acuaticos en ambitos autorizados.',
    basePrice: 5.65,
    pricingType: 'per_day',
    coverageLevels: [
      {
        name: 'Addon USD 15,000',
        price: 5.65,
        coverage: 'USD 15,000',
        description:
          'Tarifa diaria. Multitrip/Largas estadias: USD 79.10 x TAC.',
      },
      {
        name: 'Addon USD 30,000',
        price: 6.78,
        coverage: 'USD 30,000',
        description:
          'Tarifa diaria. Multitrip/Largas estadias: USD 101.70 x TAC.',
      },
    ],
    features: ['Hasta 69 anos inclusive', 'Aplica restricciones'],
    displayOrder: 7,
  },
  {
    name: 'Dispositivos Moviles',
    slug: 'dispositivos-moviles',
    category: 'tecnologia',
    shortDescription:
      'Proteccion para smartphone, tablet y notebook ante robo durante el viaje.',
    fullDescription:
      'Cobertura para dispositivos moviles durante la vigencia de tu Assist Card.',
    basePrice: 56.5,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Cobertura unica USD 1,000',
        price: 56.5,
        coverage: 'USD 1,000',
        description: 'Tarifa diaria y multitrip.',
      },
    ],
    features: [
      'Sin limite de edad',
      'No disponible para largas estadias',
      'Aplica restricciones',
    ],
    displayOrder: 8,
  },
  {
    name: 'Embarazo',
    slug: 'embarazo',
    category: 'salud',
    shortDescription:
      'Amplia la asistencia medica de urgencia por embarazo hasta semana 32.',
    fullDescription:
      'Extiende el servicio hasta la semana 32 de gestacion inclusive. No incluye chequeos y controles de rutina.',
    basePrice: 113,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Servicio adicional semana 32',
        price: 113,
        coverage: 'USD 30,000',
        description: 'Tarifa por tarjeta.',
      },
    ],
    features: ['Limite maximo de edad: 50 anos', 'Aplica restricciones'],
    displayOrder: 9,
  },
  {
    name: 'Equipaje Protegido Plus',
    slug: 'equipaje-protegido-plus',
    category: 'equipaje',
    shortDescription:
      'Protege equipaje despachado por perdida, rotura o demora mayor a 96 horas.',
    fullDescription:
      'Incluye indemnizacion por demora y dano/rotura. Aplica con PIR y aviso oportuno.',
    basePrice: 19.21,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'Plan 1',
        price: 19.21,
        coverage: 'USD 1,000 por bulto',
        description:
          'Hasta 2 bultos. Demora: hasta USD 300. Dano/rotura: USD 100.',
      },
      {
        name: 'Plan 2',
        price: 22.6,
        coverage: 'USD 1,500 por bulto',
        description:
          'Hasta 2 bultos. Demora: hasta USD 300. Dano/rotura: USD 100.',
      },
      {
        name: 'Plan 3',
        price: 28.25,
        coverage: 'USD 2,000 por bulto',
        description:
          'Hasta 2 bultos. Demora: hasta USD 300. Dano/rotura: USD 100.',
      },
    ],
    features: ['Aplica restricciones'],
    displayOrder: 10,
  },
  {
    name: 'Repatriacion Sanitaria',
    slug: 'repatriacion-sanitaria',
    category: 'viaje',
    shortDescription:
      'Traslado del paciente a su lugar de origen en avion con equipo medico especializado.',
    fullDescription:
      'Monto adicional e independiente al producto base para reducir gastos extraordinarios por accidente o enfermedad grave.',
    basePrice: 3.39,
    pricingType: 'per_day',
    coverageLevels: [
      {
        name: 'Cobertura unica USD 100,000',
        price: 3.39,
        coverage: 'USD 100,000',
        description: 'Tarifa diaria. Multitrip: USD 56.50 x TAC.',
      },
    ],
    features: [
      'Sin limite de edad',
      'No disponible para largas estadias',
      'Aplica restricciones',
    ],
    displayOrder: 11,
  },
  {
    name: 'Bolso Protegido',
    slug: 'bolso-protegido',
    category: 'equipaje',
    shortDescription:
      'Protege billetera, cartera, bolso o mochila ante robo durante el viaje.',
    fullDescription:
      'No contempla hurto y requiere denuncia policial. Disponible hasta 120 dias de viaje.',
    basePrice: 6.78,
    pricingType: 'per_trip',
    coverageLevels: [
      {
        name: 'USD 300 - Hasta 30 dias',
        price: 6.78,
        coverage: 'USD 300',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 300 - Hasta 60 dias',
        price: 13.56,
        coverage: 'USD 300',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 300 - Hasta 90 dias',
        price: 20.34,
        coverage: 'USD 300',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 300 - Hasta 120 dias',
        price: 27.12,
        coverage: 'USD 300',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 300 - MT',
        price: 10.17,
        coverage: 'USD 300',
        description: 'Cobertura por robo en modalidad multitrip.',
      },
      {
        name: 'USD 500 - Hasta 30 dias',
        price: 11.3,
        coverage: 'USD 500',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 500 - Hasta 60 dias',
        price: 22.6,
        coverage: 'USD 500',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 500 - Hasta 90 dias',
        price: 33.9,
        coverage: 'USD 500',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 500 - Hasta 120 dias',
        price: 45.2,
        coverage: 'USD 500',
        description: 'Cobertura por robo durante viaje.',
      },
      {
        name: 'USD 500 - MT',
        price: 16.95,
        coverage: 'USD 500',
        description: 'Cobertura por robo en modalidad multitrip.',
      },
    ],
    features: [
      'Sin limite de edad',
      'No contempla hurto y requiere denuncia policial',
      'No disponible para viajes de mas de 120 dias',
      'Aplica restricciones',
    ],
    displayOrder: 12,
  },
];

async function main() {
  console.log('Seeding real additional services...');

  // Keep existing records for rollback while removing them from public/admin active list.
  const deactivated = await prisma.additionalService.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  console.log(`Deactivated ${deactivated.count} previously active services.`);

  for (const service of services) {
    await prisma.additionalService.upsert({
      where: { slug: service.slug },
      update: {
        ...service,
        displayOrder: service.displayOrder - 1,
        isActive: true,
      },
      create: {
        ...service,
        displayOrder: service.displayOrder - 1,
        isActive: true,
      },
    });
  }

  console.log(`Upserted ${services.length} real services.`);
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
