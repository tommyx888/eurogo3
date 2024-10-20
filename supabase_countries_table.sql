-- Create the countries table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    visa_requirements TEXT,
    work_permit TEXT,
    language_requirements TEXT,
    job_market_overview TEXT,
    average_salaries TEXT,
    cost_of_living TEXT,
    healthcare_system TEXT,
    housing_options TEXT,
    climate TEXT,
    cultural_norms TEXT,
    laws_and_regulations TEXT,
    transportation TEXT,
    banking_and_currency TEXT,
    education_system TEXT,
    emergency_services TEXT,
    common_scams TEXT,
    political_system TEXT,
    religious_landscape TEXT,
    taxation_for_expatriates TEXT,
    social_security TEXT,
    qualifications_recognition TEXT,
    driving_regulations TEXT,
    mobile_and_internet TEXT,
    electrical_information TEXT,
    time_zone TEXT,
    public_holidays TEXT,
    lgbt_rights TEXT,
    gender_equality TEXT,
    customs_regulations TEXT,
    pet_relocation TEXT
);

-- Insert sample data for Germany
INSERT INTO countries (
    name, visa_requirements, work_permit, language_requirements, job_market_overview,
    average_salaries, cost_of_living, healthcare_system, housing_options, climate,
    cultural_norms, laws_and_regulations, transportation, banking_and_currency,
    education_system, emergency_services, common_scams, political_system,
    religious_landscape, taxation_for_expatriates, social_security,
    qualifications_recognition, driving_regulations, mobile_and_internet,
    electrical_information, time_zone, public_holidays, lgbt_rights,
    gender_equality, customs_regulations, pet_relocation
) VALUES (
    'Germany',
    'EU citizens do not need a visa. Non-EU citizens may need a visa depending on their country of origin and length of stay.',
    'EU citizens do not need a work permit. Non-EU citizens typically need a work permit, which is usually tied to a specific job offer.',
    'German is the official language. Many businesses use English, but knowing German is highly advantageous.',
    'Germany has a strong economy with opportunities in engineering, IT, healthcare, and skilled trades.',
    'The average annual salary in Germany is around €56,000, varying by profession and location.',
    'Major cities like Munich and Frankfurt are expensive. Rent, food, and utilities for a single person average €800-€1,200 per month.',
    'Germany has a universal healthcare system. Public insurance is mandatory for most residents.',
    'Options range from renting apartments to buying houses. Rent control exists in many cities.',
    'Temperate climate with warm summers and cold winters. Rainfall throughout the year.',
    'Punctuality is highly valued. Direct communication is appreciated. Recycling is taken seriously.',
    'Strong emphasis on privacy and data protection. Strict noise regulations, especially on Sundays.',
    'Excellent public transportation in cities. Extensive rail network for intercity travel.',
    'Euro is the currency. Opening a bank account requires proof of address and registration.',
    'Free public education. University education is free or low-cost for EU students.',
    'Call 112 for emergencies. Police, fire, and ambulance services are efficient.',
    'Beware of pickpocketing in tourist areas and online scams targeting expatriates.',
    'Federal parliamentary republic with a multi-party system.',
    'Christianity is the largest religion, but there''s freedom of religion. Many are non-religious.',
    'Expatriates are typically taxed on worldwide income. Tax rates are progressive, up to 45%.',
    'Comprehensive social security system including unemployment benefits and pension.',
    'Many foreign qualifications are recognized, but some professions require specific German certifications.',
    'Valid foreign licenses can be used for up to 6 months. Then, conversion to a German license is required.',
    'Good mobile coverage and internet speed. Various providers available.',
    '230V, 50Hz. Type C and F plugs are used.',
    'Central European Time (CET) or Central European Summer Time (CEST).',
    'Notable holidays include Christmas, Easter, and Tag der Deutschen Einheit (German Unity Day) on October 3rd.',
    'Same-sex marriage is legal. LGBTQ+ rights are protected by law.',
    'Gender equality is promoted in law and society, but some disparities still exist in practice.',
    'Strict regulations on importing food, plants, and animals. Duty-free allowances apply for goods from non-EU countries.',
    'Pets need microchips, vaccinations, and an EU pet passport or third-country certificate.'
);
