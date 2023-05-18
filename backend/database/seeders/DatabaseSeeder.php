<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\PublicRole;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\User;
use App\Models\Category;
use App\Models\Topic;
use App\Models\Post;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollAnswer;
use App\Models\PrivateMessage;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as FakerFactory;
use Faker\Provider\es_ES\Text as SpanishTextProvider;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {   
        // Crear una instancia del Faker en español
        $faker = FakerFactory::create('es_ES');

        // Registrar el proveedor de texto en español
        $faker->addProvider(new SpanishTextProvider($faker));

        // Public roles
        PublicRole::create([
            'name' => 'Newbie',
            'description' => 'New user',
            'posts' => 0,
        ]);
        PublicRole::create([
            'name' => 'Starter',
            'description' => 'User with more than 10 posts',
            'posts' => 10,
        ]);
        PublicRole::create([
            'name' => 'Advanced',
            'description' => 'User with more than 50 posts',
            'posts' => 50,
        ]);
        PublicRole::create([
            'name' => 'Engineer',
            'description' => 'User with more than 100 posts',
            'posts' => 100,
        ]);
        PublicRole::create([
            'name' => 'GPT',
            'description' => 'User with more than 1000 posts',
            'posts' => 1000,
        ]);


        $publicAdmin = PublicRole::create([
            'name' => 'Admin',
            'description' => 'Administrator',
        ]);
        $publicMod = PublicRole::create([
            'name' => 'Mod',
            'description' => 'Moderator',
        ]);

        // Administrative roles
        // Core Roles.
        $guestRole = Role::create([
            'name' => 'ROLE_GUEST',
            'order' => 1
        ]);
        $userRole =Role::create([
            'name' => 'ROLE_USER',
            'order' => 2
        ]);

        // Optional Roles
        $modWelcomeRole = Role::create([
            'name' => 'WELCOME_MOD',
            'order' => 3,
        ]);
        $modFundamentalsRole = Role::create([
            'name' => 'FUNDAMENTALS_MOD',
            'order' => 3
        ]);

        $modApplicationsRole = Role::create([
            'name' => 'APPLICATIONS_MOD',
            'order' => 3
        ]);

        $modEthicsRole = Role::create([
            'name' => 'ETICS_MOD',
            'order' => 3
        ]);


        $modRole = Role::create([
            'name' => 'ROLE_MOD',
            'order' => 4,
        ]);
        $adminRole = Role::create([
            'name' => 'ROLE_ADMIN',
            'admin' => true,
            'order' => 5,
        ]);

        $ownerRole = Role::create([
            'admin' => true,
            'name' => 'root',
            'order' => 6
        ]);
        // User creation
        // Core users.
        User::factory()->create(
            [
            'email' => 'none',
            'nick' => 'Guest',
            "password" => Hash::make('gue$t@foria'),
            'public_role_id' => 1
            ]
        );
        $owner = User::factory()->create([
            'id' => 2,
            'email' => 'foria.forum@gmail.com',
            'nick' => 'root',
            'password' => Hash::make('r00t@foria'),
            'public_role_id' => $publicAdmin->id,
            'email_verified_at' => now()
        ]);

        $owner->roles()->attach([$ownerRole->id]);

        // Base optional users.
        $user = User::factory()->create(
            [
            'email' => 'admin@foria.com',
            'public_role_id' => $publicAdmin->id,
            "password" => Hash::make('admin@foria'),
            ]
        );
        $user->roles()->attach([$adminRole->id]);

        $user = User::factory()->create(
            [
            'email' => 'mod@foria.com',
            'public_role_id' => $publicMod->id,
            "password" => Hash::make('mod@foria'),
            ]
        );
        $user->roles()->attach([$modRole->id,$modWelcomeRole->id,$modFundamentalsRole->id,$modApplicationsRole->id,$modEthicsRole->id]);


        $user = User::factory()->create(
            [
            'email' => 'welcome_mod@foria.com',
            "password" => Hash::make('mod@foria'),
            ]
        );
        $user->roles()->attach([$modWelcomeRole->id]);



        $user = User::factory()->create(
            [
            'email' => 'fundamentals_mod@foria.com',
            "password" => Hash::make('mod@foria'),
            ]
        );
        $user->roles()->attach([$modFundamentalsRole->id]);

        $user = User::factory()->create(
            [
            'email' => 'applications_mod@foria.com',
            "password" => Hash::make('mod@foria'),
            ]
        );
        $user->roles()->attach([$modApplicationsRole->id]);

        $user = User::factory()->create(
            [
            'email' => 'ethics_mod@foria.com',
            "password" => Hash::make('mod@foria'),
            ]
        );
        $user->roles()->attach([$modEthicsRole->id]);

        // Generic users
        User::factory()->count(15)->create();
        // Cateogires
        // Core category : Trash Category.
        Category::factory()->create([
            'id' => 1,
            'order' => 20,
            'title' => 'Trash',
            'section' => 'Admin',
            'can_view' => 8,
        ]);

        // $category = Category::factory()->create([
        //     'order' => 1,
        //     'title' => 'Normas y reglas',
        //     'description' => 'Encuentra aquí las normas y reglas de nuestra comunidad de inteligencia artificial. Asegúrate de seguirlas para mantener un ambiente respetuoso y seguro.',
        //     'section' => 'Bienvenida',
        //     'can_mod' => $adminRole->id,
        //     'can_post' => $adminRole->id,
        // ]);

        $category = Category::factory()->create([
            'order' => 1,
            'title' => 'Noticias y novedades',
            'description' => 'Mantente al día con las últimas noticias y novedades en el campo de la inteligencia artificial. Descubre los avances más recientes, investigaciones destacadas y eventos relevantes en nuestro foro',
            'section' => 'Bienvenida',
            'can_mod' => $modWelcomeRole->id,
            'can_post' => $modWelcomeRole->id,
        ]);

        $topic = Topic::factory()->create([
            'title' => 'Últimas noticias',
            'description' => 'Información actualizada sobre los avances, descubrimientos y tendencias más recientes en el campo de la inteligencia artificial.',
            'category_id' => $category->id,
            'user_id' => $adminRole->id,
            'content' => 'El mundo de la Inteligencia Artificial (IA) está en constante evolución, con nuevos desarrollos y avances cada día. La IA ya ha revolucionado muchas industrias, desde la atención médica hasta las finanzas, y no muestra signos de desaceleración. En este artículo, echaremos un vistazo a algunas de las noticias más recientes sobre la IA y sus posibles aplicaciones en un futuro próximo. También discutiremos el estado actual de la tecnología de IA y cómo podría dar forma a nuestras vidas en los próximos años. Entonces, si desea mantenerse actualizado sobre todo lo relacionado con la IA, ¡siga leyendo!',
        ]);


        $topic = Topic::factory()->create([
            'title' => 'Eventos y conferencias',
            'description' => 'Anuncios y detalles sobre eventos, conferencias, seminarios y webinars relacionados con la inteligencia artificial.',
            'category_id' => $category->id,
            'user_id' => $adminRole->id,
            'content' => $faker->realTextBetween($minNbChars = 40, $maxNbChars = 200, $indexSize = 2),
        ]);



        $topic = Topic::factory()->create([
            'title' => 'Lanzamientos de productos y actualizaciones',
            'description' => ' Información sobre los nuevos productos, servicios y actualizaciones relacionados con la inteligencia artificial.',
            'category_id' => $category->id,
            'user_id' => $adminRole->id,
            'content' => $faker->realTextBetween($minNbChars = 40, $maxNbChars = 200, $indexSize = 2),
        ]);



        $topic = Topic::factory()->create([
            'title' => 'Investigaciones y publicaciones destacadas',
            'description' => ' Destacados estudios, investigaciones y publicaciones científicas en el campo de la inteligencia artificial.',
            'category_id' => $category->id,
            'user_id' => $adminRole->id,
            'content' => $faker->realTextBetween($minNbChars = 40, $maxNbChars = 200, $indexSize = 2),
        ]);



        Category::factory()->create([
            'order' => 2,
            'title' => 'Presentaciones',
            'description' => '¡Bienvenido/a! Preséntate y recibe una cálida bienvenida en nuestro foro de inteligencia artificial. Comparte sobre ti y tus intereses en el campo de la IA.',
            'section' => 'Bienvenida',
            'can_mod' => $modWelcomeRole->id,
        ]);

        Category::factory()->create([
            'order' => 3,
            'title' => 'Dudas y sugerencias',
            'description' => '¿Tienes preguntas o sugerencias?Este es el lugar para plantear tus dudas y compartir ideas para mejorar nuestro foro de IA. Estamos aquí para ayudarte y escuchar tus opiniones.',
            'section' => 'Bienvenida',
            'can_mod' => $modWelcomeRole->id,
        ]);

        Category::factory()->create([
            'order' => 4,
            'title' => 'Aprendizaje automático',
            'description' => 'Explora los algoritmos y técnicas fundamentales del aprendizaje automático. Comparte y aprende sobre regresión, clasificación, clustering y otros aspectos clave en este campo.',
            'section' => 'Fundamentos de la IA',
            'can_mod' => $modFundamentalsRole->id,
        ]);
        
        Category::factory()->create([
            'order' => 5,
            'title' => 'Redes neuronales',
            'description' => 'Sumérgete en el fascinante mundo de las redes neuronales. Comparte conocimientos y experiencias sobre perceptrones, capas ocultas, retropropagación y otros conceptos esenciales.',
            'section' => 'Fundamentos de la IA',
            'can_mod' => $modFundamentalsRole->id,
        ]);
        
        Category::factory()->create([
            'order' => 6,
            'title' => 'Algoritmos genéticos',
            'description' => 'Explora los algoritmos genéticos y su aplicación en la inteligencia artificial. Comparte ideas, discute técnicas de evolución y descubre cómo resolver problemas utilizando enfoques evolutivos.',
            'section' => 'Fundamentos de la IA',
            'can_mod' => $modFundamentalsRole->id,
        ]);

        Category::factory()->create([
            'order' => 7,
            'title' => 'Medicina y salud',
            'description' => 'Explora las aplicaciones de la IA en medicina y salud. Discute avances en diagnóstico médico, análisis de imágenes, investigación biomédica y otros usos innovadores de la IA en el campo de la salud.',
            'section' => 'Aplicaciones de la IA',
            'can_mod' => $modApplicationsRole->id,
        ]);
        
        Category::factory()->create([
            'order' => 8,
            'title' => 'Robótica y automatización',
            'description' => 'Sumérgete en el mundo de la robótica y la automatización impulsada por la IA. Comparte información sobre robots inteligentes, automatización de procesos industriales, drones y otros avances en este emocionante campo.',
            'section' => 'Aplicaciones de la IA',
            'can_mod' => $modApplicationsRole->id,
        ]);
        
        Category::factory()->create([
            'order' => 9,
            'title' => 'Desarrollo de software en IA',
            'description' => 'Explora el desarrollo de software en el ámbito de la inteligencia artificial. Comparte recursos, herramientas, frameworks y bibliotecas populares utilizadas en el desarrollo de aplicaciones de IA.',
            'section' => 'Aplicaciones de la IA',
            'can_mod' => $modApplicationsRole->id,
        ]);

        Category::factory()->create([
            'order' => 10,
            'title' => 'Inteligencia artificial en finanzas',
            'description' => 'Explora cómo la IA está transformando la industria financiera. Discute algoritmos de trading, análisis de riesgos, asistentes virtuales financieros y otras aplicaciones de la IA en el ámbito financiero.',
            'section' => 'Aplicaciones de la IA',
            'can_mod' => $modApplicationsRole->id,
        ]);


        Category::factory()->create([
            'order' => 11,
            'title' => 'Privacidad y seguridad',
            'description' => 'Discute los aspectos éticos relacionados con la privacidad y seguridad en la IA. Aborda preocupaciones sobre el manejo de datos, protección de la privacidad, seguridad cibernética y otros dilemas éticos asociados con la IA.',
            'section' => 'Ética',
            'can_mod' => $modEthicsRole->id,
        ]);
        
        Category::factory()->create([
            'order' => 12,
            'title' => 'Impacto social de la IA',
            'description' => 'Analiza el impacto social de la IA y sus implicaciones éticas. Explora temas como el desempleo tecnológico, la desigualdad, la toma de decisiones automatizadas y otros desafíos que plantea la IA en la sociedad.',
            'section' => 'Ética',
            'can_mod' => $modEthicsRole->id,
        ]);



        // Category::factory()->count(3)->has(
        //     Topic::factory()
        //     ->count(rand(1,6))
        //     ->has(
        //         Post::factory()
        //             ->count(rand(1,6))
        //     )
        // )
        // ->create([
        //     'section' => 'Welcome',
        //     'can_mod' => $modWelcomeRole->id
        // ]);

        // Category::factory()->count(3)->has(
        //     Topic::factory()
        //     ->count(rand(1,6))
        //     ->has(
        //         Post::factory()
        //             ->count(rand(1,6))
        //     )
        // )->create([
        //     'section' => 'GPT',
        // ]);

        // Category::factory()->has(
        //     Topic::factory()
        //     ->count(rand(1,6))
        //     ->has(
        //         Post::factory()
        //             ->count(rand(1,6))
        //     )
        // )->count(4)->create([
        //     'section' => 'Imagenes',
        // ]);

        // Category::factory()->has(
        //     Topic::factory()
        //     ->count(rand(15,25))
        //     ->has(
        //         Post::factory()
        //             ->count(rand(1,6))
        //     )
        // )->count(1)->create([
        //     'title' => 'TopicPagination',
        //     'section' => 'Offtopic',
        // ]);

        // Category::factory()->has(
        //     Topic::factory()
        //     ->count(1)
        //     ->has(
        //         Post::factory()
        //             ->count(100)
        //     )
        // )->count(1)->create([
        //     'title' => 'PostPagination',
        //     'section' => 'Offtopic',
        // ]);


        // Poll::factory()->count(5)->create()
        // ->each(function ($poll){
        //     $users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        //     shuffle($users);

        //     for($i = 0; $i < rand(2,5);$i++){
        //         PollOption::factory()->create([
        //             'poll_id' => $poll->id,
        //         ]);
        //     }
        //     $poll->options->each(function ($option) use ($users,$poll) {
        //         for ($i = 0; $i < rand(5,9); $i++){
        //             if(count($users) == 0) break;
        //             $user = array_pop($users);
        //             if($poll->voted($user)) continue;
        //             PollAnswer::factory()->create([
        //                 'poll_id' => $poll->id,
        //                 'poll_option_id' => $option->id,
        //                 'user_id' => $user,
        //             ]);
        //         }
        //     });
        // });
    }
}
