import random
from datetime import date, timedelta
from decimal import Decimal

from django.core.management import call_command
from django.core.management.base import BaseCommand
from faker import Faker

from publicaciones.models import Publicacion
from usuarios.models import Experiencia, Habilidad, Perfil, Usuario

fake = Faker('es_CO')

DEMO_PASSWORD = 'Demo1234!'

USUARIOS = [
    {'email': 'maria.lopez@example.com', 'first_name': 'María', 'last_name': 'López', 'tipo': 'freelancer'},
    {'email': 'carlos.garcia@example.com', 'first_name': 'Carlos', 'last_name': 'García', 'tipo': 'freelancer'},
    {'email': 'ana.martinez@example.com', 'first_name': 'Ana', 'last_name': 'Martínez', 'tipo': 'freelancer'},
    {'email': 'jorge.ramirez@example.com', 'first_name': 'Jorge', 'last_name': 'Ramírez', 'tipo': 'ambos'},
    {'email': 'laura.hernandez@example.com', 'first_name': 'Laura', 'last_name': 'Hernández', 'tipo': 'freelancer'},
    {'email': 'david.torres@example.com', 'first_name': 'David', 'last_name': 'Torres', 'tipo': 'ambos'},
    {'email': 'camila.rojas@example.com', 'first_name': 'Camila', 'last_name': 'Rojas', 'tipo': 'cliente'},
    {'email': 'andres.moreno@example.com', 'first_name': 'Andrés', 'last_name': 'Moreno', 'tipo': 'cliente'},
]

BIOS = [
    'Diseñadora gráfica con más de 5 años de experiencia en branding y UI/UX. Apasionada por crear experiencias visuales memorables.',
    'Desarrollador full-stack especializado en Python y React. Me encanta construir productos digitales escalables y bien diseñados.',
    'Especialista en marketing digital y estrategia de contenido. Ayudo a empresas a crecer su presencia online de forma orgánica.',
    'Ingeniero de software con enfoque en arquitectura cloud y DevOps. Experiencia en AWS, Docker y CI/CD.',
    'Redactora creativa y copywriter freelance. Transformo ideas complejas en textos claros que conectan con la audiencia.',
    'Editor de video y motion designer. Creo contenido audiovisual para marcas, startups y creadores de contenido.',
    'Emprendedora digital buscando talento para proyectos de e-commerce y aplicaciones móviles.',
    'Product manager con experiencia en startups tech. Busco freelancers para proyectos de desarrollo y diseño.',
]

EXPERIENCIAS = [
    {'empresa': 'Globant', 'cargo': 'Diseñadora UI/UX Senior', 'ubicacion': 'Bogotá, Colombia'},
    {'empresa': 'MercadoLibre', 'cargo': 'Frontend Developer', 'ubicacion': 'Buenos Aires, Argentina'},
    {'empresa': 'Rappi', 'cargo': 'Content Strategist', 'ubicacion': 'Bogotá, Colombia'},
    {'empresa': 'Platzi', 'cargo': 'Backend Developer', 'ubicacion': 'Remoto'},
    {'empresa': 'Freelance', 'cargo': 'Copywriter', 'ubicacion': 'Medellín, Colombia'},
    {'empresa': 'Accenture', 'cargo': 'DevOps Engineer', 'ubicacion': 'Ciudad de México, México'},
    {'empresa': 'Nequi', 'cargo': 'Product Manager', 'ubicacion': 'Bogotá, Colombia'},
    {'empresa': 'Zemoga', 'cargo': 'Full Stack Developer', 'ubicacion': 'Barranquilla, Colombia'},
    {'empresa': 'Bancolombia', 'cargo': 'Analista de datos', 'ubicacion': 'Medellín, Colombia'},
    {'empresa': 'Crepes & Waffles', 'cargo': 'Community Manager', 'ubicacion': 'Bogotá, Colombia'},
    {'empresa': 'Google', 'cargo': 'Software Engineer Intern', 'ubicacion': 'Mountain View, USA'},
    {'empresa': 'Komet Sales', 'cargo': 'React Developer', 'ubicacion': 'Miami, USA'},
]

PUBLICACIONES = [
    {
        'titulo': 'Diseño de logotipo profesional para tu marca',
        'descripcion': 'Creo logotipos únicos y memorables que representan la esencia de tu marca. '
                       'Incluye investigación de mercado, 3 propuestas iniciales, revisiones ilimitadas '
                       'y entrega en formatos vectoriales (AI, SVG, PNG, PDF).',
        'categoria': 'diseno',
        'precio': Decimal('250000.00'),
        'tiempo_entrega': '5 días',
        'incluye': ['3 propuestas iniciales', 'Revisiones ilimitadas', 'Archivos fuente AI/SVG', 'Manual de marca básico'],
    },
    {
        'titulo': 'Desarrollo de landing page con React y Tailwind',
        'descripcion': 'Desarrollo landing pages modernas, responsivas y optimizadas para conversión. '
                       'Uso React, Next.js y Tailwind CSS para garantizar rendimiento y diseño impecable. '
                       'Incluye formulario de contacto funcional y despliegue.',
        'categoria': 'desarrollo',
        'precio': Decimal('800000.00'),
        'tiempo_entrega': '7 días',
        'incluye': ['Diseño responsivo', 'SEO básico', 'Formulario de contacto', 'Deploy en Vercel'],
    },
    {
        'titulo': 'Estrategia de marketing digital para redes sociales',
        'descripcion': 'Diseño una estrategia completa de marketing digital para tus redes sociales. '
                       'Incluye análisis de audiencia, calendario de contenido para 1 mes, lineamientos '
                       'gráficos y recomendaciones de pauta publicitaria.',
        'categoria': 'marketing',
        'precio': Decimal('450000.00'),
        'tiempo_entrega': '10 días',
        'incluye': ['Análisis de audiencia', 'Calendario 30 días', 'Guía de contenido', 'Reporte de métricas'],
    },
    {
        'titulo': 'Redacción de artículos SEO para blog corporativo',
        'descripcion': 'Escribo artículos optimizados para posicionamiento en buscadores. '
                       'Cada artículo incluye investigación de keywords, estructura SEO, '
                       'meta descripción y enlaces internos sugeridos.',
        'categoria': 'redaccion',
        'precio': Decimal('120000.00'),
        'tiempo_entrega': '3 días',
        'incluye': ['Investigación de keywords', 'Artículo de 1500+ palabras', 'Meta descripción', 'Imágenes sugeridas'],
    },
    {
        'titulo': 'Edición profesional de video para YouTube',
        'descripcion': 'Edito videos con calidad profesional para canales de YouTube. '
                       'Incluye corrección de color, transiciones, subtítulos, música de fondo '
                       'libre de derechos y thumbnail personalizado.',
        'categoria': 'video',
        'precio': Decimal('350000.00'),
        'tiempo_entrega': '4 días',
        'incluye': ['Corrección de color', 'Subtítulos', 'Música libre de derechos', 'Thumbnail personalizado'],
    },
    {
        'titulo': 'Desarrollo de API REST con Django y PostgreSQL',
        'descripcion': 'Diseño y desarrollo APIs RESTful robustas usando Django REST Framework. '
                       'Incluye autenticación JWT, documentación Swagger, tests unitarios '
                       'y despliegue en contenedor Docker.',
        'categoria': 'desarrollo',
        'precio': Decimal('1200000.00'),
        'tiempo_entrega': '14 días',
        'incluye': ['Autenticación JWT', 'Documentación Swagger', 'Tests unitarios', 'Docker'],
    },
    {
        'titulo': 'Diseño de interfaz UI/UX para aplicación móvil',
        'descripcion': 'Diseño interfaces intuitivas y atractivas para aplicaciones móviles. '
                       'Proceso completo: wireframes, prototipos interactivos en Figma y '
                       'sistema de diseño reutilizable.',
        'categoria': 'diseno',
        'precio': Decimal('900000.00'),
        'tiempo_entrega': '12 días',
        'incluye': ['Wireframes', 'Prototipo interactivo Figma', 'Sistema de diseño', 'Handoff para desarrollo'],
    },
    {
        'titulo': 'Gestión de campañas en Google Ads',
        'descripcion': 'Configuro y optimizo campañas de Google Ads para maximizar tu ROI. '
                       'Incluye investigación de keywords, creación de anuncios, segmentación '
                       'de audiencia y reportes semanales de rendimiento.',
        'categoria': 'marketing',
        'precio': Decimal('600000.00'),
        'tiempo_entrega': '30 días',
        'incluye': ['Configuración de campañas', 'Investigación de keywords', 'Reportes semanales', 'Optimización continua'],
    },
    {
        'titulo': 'Traducción profesional español-inglés de documentos',
        'descripcion': 'Ofrezco traducciones precisas y naturales entre español e inglés. '
                       'Especialidad en documentos técnicos, legales y de marketing. '
                       'Revisión por segundo traductor incluida.',
        'categoria': 'redaccion',
        'precio': Decimal('80000.00'),
        'tiempo_entrega': '2 días',
        'incluye': ['Traducción profesional', 'Revisión por par', 'Formato preservado', 'Glosario de términos'],
    },
    {
        'titulo': 'Creación de motion graphics para redes sociales',
        'descripcion': 'Creo animaciones cortas y atractivas para Instagram, TikTok y LinkedIn. '
                       'Perfectas para anuncios, explicaciones de producto o contenido de marca.',
        'categoria': 'video',
        'precio': Decimal('400000.00'),
        'tiempo_entrega': '5 días',
        'incluye': ['Animación hasta 30 segundos', 'Música incluida', '3 formatos (1:1, 9:16, 16:9)', '1 revisión'],
    },
    {
        'titulo': 'Desarrollo de tienda online con Shopify',
        'descripcion': 'Configuro tu tienda en Shopify desde cero: diseño personalizado, '
                       'integración de pasarela de pagos, catálogo de productos y optimización móvil.',
        'categoria': 'desarrollo',
        'precio': Decimal('1500000.00'),
        'tiempo_entrega': '15 días',
        'incluye': ['Diseño personalizado', 'Pasarela de pagos', 'Hasta 50 productos', 'Capacitación'],
    },
    {
        'titulo': 'Consultoría SEO y auditoría de sitio web',
        'descripcion': 'Realizo una auditoría completa de tu sitio web enfocada en SEO técnico, '
                       'contenido y autoridad de dominio. Entrego un plan de acción priorizado '
                       'con recomendaciones concretas.',
        'categoria': 'marketing',
        'precio': Decimal('350000.00'),
        'tiempo_entrega': '7 días',
        'incluye': ['Auditoría técnica', 'Análisis de contenido', 'Análisis de backlinks', 'Plan de acción'],
    },
    {
        'titulo': 'Diseño de presentaciones corporativas en PowerPoint',
        'descripcion': 'Diseño presentaciones visualmente impactantes para reuniones, '
                       'pitch decks e informes. Plantillas editables con tu identidad de marca.',
        'categoria': 'diseno',
        'precio': Decimal('180000.00'),
        'tiempo_entrega': '3 días',
        'incluye': ['Hasta 20 slides', 'Plantilla editable', 'Iconografía personalizada', 'Versión PDF'],
    },
    {
        'titulo': 'Automatización de procesos con Python y scripts',
        'descripcion': 'Automatizo tareas repetitivas de tu negocio: scraping de datos, '
                       'generación de reportes, procesamiento de archivos y más. '
                       'Soluciones a medida con Python.',
        'categoria': 'desarrollo',
        'precio': Decimal('500000.00'),
        'tiempo_entrega': '7 días',
        'incluye': ['Script personalizado', 'Documentación', 'Soporte 1 semana', 'Código fuente'],
    },
    {
        'titulo': 'Redacción de copy para landing pages y ads',
        'descripcion': 'Escribo textos persuasivos que convierten visitantes en clientes. '
                       'Especialidad en landing pages, anuncios de Facebook/Google y emails.',
        'categoria': 'redaccion',
        'precio': Decimal('150000.00'),
        'tiempo_entrega': '3 días',
        'incluye': ['Copy para landing page', 'Variantes A/B', 'CTA optimizados', 'Headlines'],
    },
]

HABILIDADES_POR_USUARIO = {
    0: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'UI/UX Design', 'Tailwind CSS'],
    1: ['Python', 'React', 'Django', 'PostgreSQL', 'Docker', 'TypeScript'],
    2: ['SEO', 'Google Analytics', 'Content Marketing', 'Google Ads', 'Facebook Ads'],
    3: ['Python', 'Docker', 'AWS', 'DevOps', 'Linux', 'Go'],
    4: ['Redacción Creativa', 'Copywriting', 'SEO', 'Traducción', 'WordPress'],
    5: ['Video Editing', 'Motion Graphics', 'Adobe Photoshop', 'Figma', 'Blender'],
    6: ['Project Management', 'Scrum', 'Agile', 'Excel Avanzado'],
    7: ['Project Management', 'Scrum', 'Data Analysis', 'Power BI'],
}

PUBLICACION_CREADOR_INDEX = [0, 1, 2, 4, 5, 1, 0, 2, 4, 5, 3, 2, 0, 1, 4]


class Command(BaseCommand):
    help = 'Seed the database with demo data for all entities'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete existing demo data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self._clear_demo_data()

        call_command('seed_habilidades')
        habilidades = {h.nombre: h for h in Habilidad.objects.all()}

        usuarios_creados = self._crear_usuarios(habilidades)
        self._crear_experiencias(usuarios_creados)
        self._crear_publicaciones(usuarios_creados)

        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully'))

    def _clear_demo_data(self):
        demo_emails = [u['email'] for u in USUARIOS]
        Publicacion.objects.filter(creador__email__in=demo_emails).delete()
        Experiencia.objects.filter(perfil__usuario__email__in=demo_emails).delete()
        Perfil.objects.filter(usuario__email__in=demo_emails).delete()
        Usuario.objects.filter(email__in=demo_emails).delete()
        self.stdout.write('Cleared existing demo data')

    def _crear_usuarios(self, habilidades):
        usuarios_creados = []
        for i, data in enumerate(USUARIOS):
            user, created = Usuario.objects.get_or_create(
                email=data['email'],
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                },
            )
            if created:
                user.set_password(DEMO_PASSWORD)
                user.save()

            perfil, _ = Perfil.objects.get_or_create(
                usuario=user,
                defaults={
                    'tipo_usuario': data['tipo'],
                    'bio': BIOS[i],
                    'telefono': fake.phone_number()[:20],
                    'url_portafolio': f'https://portafolio.example.com/{data["first_name"].lower()}',
                },
            )

            skill_names = HABILIDADES_POR_USUARIO.get(i, [])
            perfil_habilidades = [habilidades[name] for name in skill_names if name in habilidades]
            if perfil_habilidades:
                perfil.habilidades.set(perfil_habilidades)

            usuarios_creados.append(user)
            status_text = 'created' if created else 'already exists'
            self.stdout.write(f'  Usuario {data["email"]} ({status_text})')

        return usuarios_creados

    def _crear_experiencias(self, usuarios):
        if Experiencia.objects.filter(perfil__usuario__in=usuarios).exists():
            self.stdout.write('  Experiences already exist, skipping')
            return

        random.seed(42)
        for user in usuarios:
            num_exp = random.randint(1, 3)
            exps = random.sample(EXPERIENCIAS, num_exp)
            for exp_data in exps:
                year_start = random.randint(2019, 2024)
                month_start = random.randint(1, 12)
                fecha_inicio = date(year_start, month_start, 1)
                is_current = random.random() < 0.3
                fecha_fin = None if is_current else fecha_inicio + timedelta(days=random.randint(180, 730))

                Experiencia.objects.create(
                    perfil=user.perfil,
                    empresa=exp_data['empresa'],
                    cargo=exp_data['cargo'],
                    descripcion=fake.paragraph(nb_sentences=3),
                    fecha_inicio=fecha_inicio,
                    fecha_fin=fecha_fin,
                    ubicacion=exp_data['ubicacion'],
                )
            self.stdout.write(f'  {num_exp} experiences for {user.email}')

    def _crear_publicaciones(self, usuarios):
        if Publicacion.objects.filter(creador__in=usuarios).exists():
            self.stdout.write('  Publications already exist, skipping')
            return

        for i, pub_data in enumerate(PUBLICACIONES):
            creador = usuarios[PUBLICACION_CREADOR_INDEX[i]]
            Publicacion.objects.create(
                titulo=pub_data['titulo'],
                descripcion=pub_data['descripcion'],
                categoria=pub_data['categoria'],
                precio=pub_data['precio'],
                tiempo_entrega=pub_data['tiempo_entrega'],
                incluye=pub_data['incluye'],
                estado='publicado',
                creador=creador,
            )
        self.stdout.write(f'  {len(PUBLICACIONES)} publications created')
