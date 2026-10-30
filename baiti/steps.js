// From OFFICIAL_STEPS.md (sources S1–S14). ⚠ = verify on TAMM.
const TAMM='https://www.tamm.abudhabi/';
const L={permit:'https://www.tamm.abudhabi/en/life-events/business/ManageyourPermitsMemberships/Constructions/RequestforBuildingPermitIssuance',
cc:'https://www.tamm.abudhabi/en/life-events/business/ManageyourLicencescertificates/Business-Support/RequesttoOpenaCompletionCertificateFile',
adha:'https://www.iskan.abudhabi/',dmt:'https://www.dmt.gov.ae/',addc:'https://www.addc.ae/en-US/home/service-categories/connection-water-services/Pages/water-supply-activation.aspx',
aadc:'https://aadc.ae/en/pages/New_Water_Connection.aspx',fab:'https://www.bankfab.com/en-ae/personal/national-housing-loan/consultants-and-contractors',adcda:'https://www.adcda.gov.ae/',eand:'https://www.etisalat.ae/',du:'https://www.du.ae/no-objection-certificate'};
const PHASES=[
{id:'p0',ar:'الأرض والأهلية',en:'Land & eligibility',w:5,items:[
 ['تسجيل الأرض باسم المالك وخلوها من الموانع','Plot registered to owner, free of impediments','ADHA',L.adha,'S7'],
 ['اعتماد قرض الإسكان (إن وجد) ورهن الأرض','Housing loan approval (if any) & plot mortgage','ADHA',L.adha,'S7'],
 ['برنامج الثقافة المالية – تطبيق إسكان أبوظبي','Financial Literacy Program – Iskan app','ADHA',L.adha,'S8']]},
{id:'p1',ar:'الاستشاري والتصميم',en:'Consultant & design',w:10,items:[
 ['تعيين استشاري مسجّل لدى البلدية','Appoint DMT-registered consultant','DMT',L.dmt,'S1'],
 ['تقرير فحص التربة ⚠','Soil investigation report ⚠','DMT/TAMM',TAMM,'—'],
 ['التصاميم وفق أحكام السكن الخاص وكود أبوظبي','Design per Private Housing Provisions & AD codes','DMT',L.dmt,'S1'],
 ['عدم ممانعة: الكهرباء والماء، الاتصالات، الدفاع المدني','NOCs: power & water, telecom, Civil Defence','TAQA/e&/du/ADCDA',TAMM,'S13,S14']]},
{id:'p2',ar:'رخصة البناء',en:'Building permit',w:5,items:[
 ['طلب إصدار رخصة بناء (عبر الاستشاري)','Request Building Permit Issuance (by consultant)','DMT · TAMM',L.permit,'S2'],
 ['رخصة الأعمال المرحلية: الحفر ثم الأساسات ⚠','Phased works permit: excavation then foundations ⚠','DMT · TAMM',TAMM,'—'],
 ['متابعة المشروع على منصة «بناء»','Follow the project on Binaa','DMT',L.dmt,'S4']]},
{id:'p3',ar:'العقد والتجهيز',en:'Contract & mobilisation',w:5,items:[
 ['توقيع عقد المقاول (نموذج البنك لقروض الإسكان)','Sign contractor contract (bank form for loans)','FAB/ADHA',L.fab,'S9'],
 ['تأمين الموقع والعمال ورخص سارية','Site & worker insurance, valid licences','FAB',L.fab,'S9'],
 ['إشعار بدء العمل (المقاول، يعتمده الاستشاري) ⚠','Work start notice (contractor, consultant approves) ⚠','DMT · TAMM',TAMM,'—']]},
{id:'p4',ar:'الحفر والأساسات',en:'Excavation & foundations',w:12,items:[
 ['الحفر والسند ونزح المياه إن لزم','Excavation, shoring, dewatering','Contractor',TAMM,'S1'],
 ['صب الأساسات','Foundations cast','Contractor',TAMM,'S1'],
 ['طلب تفتيش الأساسات عبر تم','Request foundation inspection on TAMM','DMT',TAMM,'—']]},
{id:'p5',ar:'الهيكل الخرساني',en:'Structure',w:18,items:[
 ['الأعمدة والأسقف','Columns & slabs','Contractor',TAMM,'S1'],
 ['السقف الأخير','Roof slab','Contractor',TAMM,'S1'],
 ['تفتيش الهيكل','Structure inspection','DMT',TAMM,'—']]},
{id:'p6',ar:'الطابوق',en:'Blockwork',w:8,items:[
 ['الجدران الخارجية والداخلية','External & internal walls','Contractor',TAMM,'—']]},
{id:'p7',ar:'الكهروميكانيك',en:'MEP',w:12,items:[
 ['تمديدات الكهرباء والسباكة والتكييف','Electrical, plumbing, AC rough-in','Contractor',TAMM,'—'],
 ['تمديدات الاتصالات حسب مواصفات المشغّل','Telecom ducts per operator spec','e&/du',L.eand,'S13'],
 ['أنظمة السلامة من الحريق','Fire safety systems','ADCDA',L.adcda,'S14']]},
{id:'p8',ar:'التشطيبات والأعمال الخارجية',en:'Finishes & external',w:15,items:[
 ['اللياسة والبلاط والصبغ والأبواب','Plaster, tiles, paint, doors','Contractor',TAMM,'—'],
 ['السور والخزان والتنسيق','Boundary wall, tank, landscaping','Contractor',L.aadc,'S11']]},
{id:'p9',ar:'شهادة الإنجاز',en:'Completion certificate',w:5,items:[
 ['فتح ملف شهادة الإنجاز (الاستشاري/المقاول)','Open completion certificate file','DMT · TAMM',L.cc,'S3'],
 ['موافقات الجهات: الدفاع المدني، الكهرباء، الماء، الصرف، الاتصالات ⚠','Entity approvals: Civil Defence, power, water, sewer, telecom ⚠','Multiple',L.cc,'S3,S14'],
 ['المخططات النهائية As-built ⚠','As-built drawings ⚠','Consultant',L.cc,'—']]},
{id:'p10',ar:'توصيل الخدمات',en:'Utilities',w:3,items:[
 ['تفعيل الماء (أبوظبي ADDC.06): مخطط + شهادة إنجاز + هوية','Water activation ADDC.06: site plan + completion cert + EID','TAQA',L.addc,'S10'],
 ['العين: الكهرباء قبل الماء، اعتماد موقع الخزان','Al Ain: electricity before water; tank location approval','TAQA (AADC)',L.aadc,'S11'],
 ['توصيل الاتصالات','Telecom connection','e&/du',L.du,'S13']]},
{id:'p11',ar:'الاستلام',en:'Handover',w:2,items:[
 ['إغلاق الملاحظات واستلام البيت','Close snags & receive the house','Contractor',L.fab,'S9'],
 ['بداية فترة الصيانة حسب العقد','Maintenance period starts per contract','Contractor',L.adha,'S8']]}];
