import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const jobs = [
  {
    slug: "general-labourer-warehouse-mississauga",
    title: "General Labourer - Warehouse",
    category: "Warehouse & Logistics",
    location: "Mississauga, ON",
    employmentType: "TEMP_TO_PERM",
    payRange: "$18 - $20 / hr",
    featured: true,
    summary:
      "Join a fast-paced distribution centre. Loading, sorting and order picking. Multiple shifts available.",
    description:
      "We are hiring General Labourers for a busy distribution centre in Mississauga. You will be loading and unloading trucks, sorting packages, and picking orders to meet daily targets. Steady hours with the opportunity to move into a permanent role.",
    requirements:
      "Able to lift up to 50 lbs;Comfortable standing for full shifts;Reliable transportation;Safety boots required",
  },
  {
    slug: "forklift-operator-brampton",
    title: "Forklift Operator (Reach & Counterbalance)",
    category: "Warehouse & Logistics",
    location: "Brampton, ON",
    employmentType: "PERMANENT",
    payRange: "$22 - $25 / hr",
    featured: true,
    summary:
      "Certified forklift operators needed for a leading 3PL. Reach and counterbalance experience an asset.",
    description:
      "Operate reach and counterbalance forklifts to move product safely and efficiently across the warehouse. Maintain accurate inventory counts and follow all health & safety protocols.",
    requirements:
      "Valid forklift licence;1+ year operating experience;Strong attention to detail;Able to work rotating shifts",
  },
  {
    slug: "machine-operator-cnc-vaughan",
    title: "CNC Machine Operator",
    category: "Manufacturing",
    location: "Vaughan, ON",
    employmentType: "PERMANENT",
    payRange: "$24 - $28 / hr",
    summary:
      "Set up and run CNC equipment for a precision manufacturer. Blueprint reading required.",
    description:
      "Set up, operate and monitor CNC machines to produce precision parts. Read blueprints, perform quality inspections, and make adjustments to maintain tolerances.",
    requirements:
      "2+ years CNC experience;Ability to read blueprints and use measuring tools;Mechanical aptitude;Quality focused",
  },
  {
    slug: "administrative-assistant-toronto",
    title: "Administrative Assistant",
    category: "Office & Administration",
    location: "Toronto, ON",
    employmentType: "TEMP_TO_PERM",
    payRange: "$23 - $26 / hr",
    summary:
      "Support a growing office with scheduling, data entry and front-desk reception duties.",
    description:
      "Provide administrative support including calendar management, document preparation, data entry and reception. You are organized, professional and comfortable with MS Office.",
    requirements:
      "1+ year administrative experience;Proficient in MS Office;Excellent communication;Strong organizational skills",
  },
  {
    slug: "accounts-payable-clerk-markham",
    title: "Accounts Payable Clerk",
    category: "Accounting & Finance",
    location: "Markham, ON",
    employmentType: "PERMANENT",
    payRange: "$50,000 - $58,000 / yr",
    summary:
      "Process invoices and payments for a mid-size firm. ERP experience preferred.",
    description:
      "Handle full-cycle accounts payable: invoice matching, coding, payment runs and vendor reconciliations. Support month-end close and assist with audits.",
    requirements:
      "2+ years AP experience;Experience with an ERP (SAP, NetSuite, etc.);Strong Excel skills;Detail oriented",
  },
  {
    slug: "customer-service-representative-remote",
    title: "Customer Service Representative",
    category: "Customer Service",
    location: "Remote (ON)",
    employmentType: "TEMPORARY",
    payRange: "$20 - $22 / hr",
    summary:
      "Handle inbound customer enquiries by phone, email and chat for a seasonal contract.",
    description:
      "Deliver excellent customer service across phone, email and live chat. Resolve enquiries, document interactions and escalate where needed. Equipment provided.",
    requirements:
      "Previous call-centre or customer service experience;Reliable home internet;Clear communication;Available for shift work",
  },
  {
    slug: "production-worker-food-mississauga",
    title: "Production Worker - Food Manufacturing",
    category: "Manufacturing",
    location: "Mississauga, ON",
    employmentType: "TEMP_TO_PERM",
    payRange: "$18.50 / hr",
    summary:
      "Assembly-line production in a clean food-grade facility. No experience needed - training provided.",
    description:
      "Work on a food production line packaging and inspecting product. Maintain cleanliness and follow food-safety (GMP/HACCP) standards. Great entry point with permanent opportunities.",
    requirements:
      "Able to stand for full shifts;Comfortable in a cold/warm environment;Team player;Willing to follow safety standards",
  },
  {
    slug: "skilled-welder-mig-tig-hamilton",
    title: "Skilled Welder (MIG/TIG)",
    category: "Skilled Trades",
    location: "Hamilton, ON",
    employmentType: "PERMANENT",
    payRange: "$28 - $34 / hr",
    featured: true,
    summary:
      "Experienced MIG/TIG welders for a structural steel fabricator. Day shift.",
    description:
      "Perform MIG and TIG welding on structural and custom fabrication projects. Read drawings, prepare materials and ensure weld quality to CWB standards.",
    requirements:
      "3+ years welding experience;MIG and TIG proficiency;Blueprint reading;CWB ticket an asset",
  },
];

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@worksi.net").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.ADMIN_NAME || "WorkSi Admin";
  const existing = await prisma.recruiterUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }
  await prisma.recruiterUser.create({
    data: { email, name, role: "ADMIN", passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`Created admin user: ${email} (password from ADMIN_PASSWORD env, default "ChangeMe123!")`);
}

async function main() {
  console.log("Seeding jobs...");
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: job,
      create: job,
    });
  }
  console.log(`Seeded ${jobs.length} jobs.`);
  await seedAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
