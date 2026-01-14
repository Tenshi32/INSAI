-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-12-2025 a las 16:08:59
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `insai_poa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` bigint(12) NOT NULL,
  `id_data` bigint(12) NOT NULL,
  `hora` time NOT NULL,
  `fecha` date NOT NULL,
  `accion` varchar(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cabeceras`
--

CREATE TABLE `cabeceras` (
  `id_cabecera` bigint(12) NOT NULL,
  `proyecto` varchar(100) NOT NULL,
  `enfoque_estrategico` varchar(100) NOT NULL,
  `sector` varchar(20) NOT NULL,
  `objetivos` varchar(100) NOT NULL,
  `actividad` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cabeceras_data`
--

CREATE TABLE `cabeceras_data` (
  `id_cabecera_data` bigint(12) NOT NULL,
  `id_cabecera` bigint(12) NOT NULL,
  `id_lineamiento` bigint(12) NOT NULL,
  `id_departamento` int(12) NOT NULL,
  `id_observado` bigint(12) NOT NULL,
  `id_tipo_poa` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes`
--

CREATE TABLE `comprobantes` (
  `id_comprobante` bigint(12) NOT NULL,
  `ruta_carpeta` varchar(100) NOT NULL,
  `fecha_carga` date NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `status` enum('1','0') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes_data`
--

CREATE TABLE `comprobantes_data` (
  `id_comprobante_data` bigint(12) NOT NULL,
  `id_comprobante` bigint(12) NOT NULL,
  `id_observado` bigint(12) NOT NULL,
  `id_metas` bigint(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicatorios`
--

CREATE TABLE `comunicatorios` (
  `id_comunicatorio` bigint(12) NOT NULL,
  `id_lineamiento` bigint(12) NOT NULL,
  `fecha_carga` date NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `controles`
--

CREATE TABLE `controles` (
  `id_control` bigint(12) NOT NULL,
  `id_comprobante` bigint(12) NOT NULL,
  `puntuacion` int(10) NOT NULL,
  `observacion` varchar(100) NOT NULL,
  `status` enum('1','0') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(12) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id_estado` int(12) NOT NULL,
  `estado` varchar(250) NOT NULL,
  `iso_3166` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estado`, `estado`, `iso_3166`) VALUES
(1, 'Amazonas', 'VE-X'),
(2, 'Anzoátegui', 'VE-B'),
(3, 'Apure', 'VE-C'),
(4, 'Aragua', 'VE-D'),
(5, 'Barinas', 'VE-E'),
(6, 'Bolívar', 'VE-F'),
(7, 'Carabobo', 'VE-G'),
(8, 'Cojedes', 'VE-H'),
(9, 'Delta Amacuro', 'VE-Y'),
(10, 'Falcón', 'VE-I'),
(11, 'Guárico', 'VE-J'),
(12, 'Lara', 'VE-K'),
(13, 'Mérida', 'VE-L'),
(14, 'Miranda', 'VE-M'),
(15, 'Monagas', 'VE-N'),
(16, 'Nueva Esparta', 'VE-O'),
(17, 'Portuguesa', 'VE-P'),
(18, 'Sucre', 'VE-R'),
(19, 'Táchira', 'VE-S'),
(20, 'Trujillo', 'VE-T'),
(21, 'Vargas', 'VE-W'),
(22, 'Yaracuy', 'VE-U'),
(23, 'Zulia', 'VE-V'),
(24, 'Distrito Capital', 'VE-A'),
(25, 'Dependencias Federales', 'VE-Z');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lineamientos`
--

CREATE TABLE `lineamientos` (
  `id_lineamiento` bigint(12) NOT NULL,
  `normas_legales` varchar(200) NOT NULL,
  `enfoque_estrategico` varchar(100) NOT NULL,
  `lineamientos` varchar(200) NOT NULL,
  `fecha_carga` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metas_data`
--

CREATE TABLE `metas_data` (
  `id_meta_data` bigint(12) NOT NULL,
  `id_meta` bigint(12) NOT NULL,
  `id_observado` bigint(12) NOT NULL,
  `id_cabecera_data` bigint(12) NOT NULL,
  `id_ubicacion` bigint(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metas_fisicas`
--

CREATE TABLE `metas_fisicas` (
  `id_meta` bigint(12) NOT NULL,
  `acciones` varchar(200) NOT NULL,
  `distribucion_trimestre` int(3) NOT NULL,
  `actividad_trimestre` int(3) NOT NULL,
  `total_actividad` int(3) NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metas_fisicas`
--

INSERT INTO `metas_fisicas` (`id_meta`, `acciones`, `distribucion_trimestre`, `actividad_trimestre`, `total_actividad`, `descripcion`) VALUES
(1, 'acciones', 0, 0, 1, 'desc'),
(2, 'acciones', 0, 0, 1, 'desc'),
(3, 'acciones', 0, 0, 1, 'desc'),
(4, 'acciones2', 2, 3, 2, 'desc2'),
(5, 'acciones2', 2, 3, 2, 'desc2'),
(6, 'acciones2', 2, 3, 2, 'desc2'),
(7, 'acciones2', 2, 3, 2, 'desc2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `municipios`
--

CREATE TABLE `municipios` (
  `id_municipio` int(12) NOT NULL,
  `municipio` varchar(250) NOT NULL,
  `id_estado` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `municipios`
--

INSERT INTO `municipios` (`id_municipio`, `municipio`, `id_estado`) VALUES
(1, 'Alto Orinoco', 1),
(2, 'Atabapo', 1),
(3, 'Atures', 1),
(4, 'Autana', 1),
(5, 'Manapiare', 1),
(6, 'Maroa', 1),
(7, 'Río Negro', 1),
(8, 'Anaco', 2),
(9, 'Aragua', 2),
(10, 'Manuel Ezequiel Bruz', 2),
(11, 'Diego Bautista Urban', 2),
(12, 'Fernando Peñalver', 2),
(13, 'Francisco Del Carmen', 2),
(14, 'General Sir Arthur M', 2),
(15, 'Guanta', 2),
(16, 'Independencia', 2),
(17, 'José Gregorio Monaga', 2),
(18, 'Juan Antonio Sotillo', 2),
(19, 'Juan Manuel Cajigal', 2),
(20, 'Libertad', 2),
(21, 'Francisco de Miranda', 2),
(22, 'Pedro María Freites', 2),
(23, 'Píritu', 2),
(24, 'San José de Guanipa', 2),
(25, 'San Juan de Capistra', 2),
(26, 'Santa Ana', 2),
(27, 'Simón Bolívar', 2),
(28, 'Simón Rodríguez', 2),
(29, 'Achaguas', 3),
(30, 'Biruaca', 3),
(31, 'Muñóz', 3),
(32, 'Páez', 3),
(33, 'Pedro Camejo', 3),
(34, 'Rómulo Gallegos', 3),
(35, 'San Fernando', 3),
(36, 'Atanasio Girardot', 4),
(37, 'Bolívar', 4),
(38, 'Camatagua', 4),
(39, 'Francisco Linares Al', 4),
(40, 'José Ángel Lamas', 4),
(41, 'José Félix Ribas', 4),
(42, 'José Rafael Revenga', 4),
(43, 'Libertador', 4),
(44, 'Mario Briceño Iragor', 4),
(45, 'Ocumare de la Costa ', 4),
(46, 'San Casimiro', 4),
(47, 'San Sebastián', 4),
(48, 'Santiago Mariño', 4),
(49, 'Santos Michelena', 4),
(50, 'Sucre', 4),
(51, 'Tovar', 4),
(52, 'Urdaneta', 4),
(53, 'Zamora', 4),
(54, 'Alberto Arvelo Torre', 5),
(55, 'Andrés Eloy Blanco', 5),
(56, 'Antonio José de Sucr', 5),
(57, 'Arismendi', 5),
(58, 'Barinas', 5),
(59, 'Bolívar', 5),
(60, 'Cruz Paredes', 5),
(61, 'Ezequiel Zamora', 5),
(62, 'Obispos', 5),
(63, 'Pedraza', 5),
(64, 'Rojas', 5),
(65, 'Sosa', 5),
(66, 'Caroní', 6),
(67, 'Cedeño', 6),
(68, 'El Callao', 6),
(69, 'Gran Sabana', 6),
(70, 'Heres', 6),
(71, 'Piar', 6),
(72, 'Angostura (Raúl Leon', 6),
(73, 'Roscio', 6),
(74, 'Sifontes', 6),
(75, 'Sucre', 6),
(76, 'Padre Pedro Chien', 6),
(77, 'Bejuma', 7),
(78, 'Carlos Arvelo', 7),
(79, 'Diego Ibarra', 7),
(80, 'Guacara', 7),
(81, 'Juan José Mora', 7),
(82, 'Libertador', 7),
(83, 'Los Guayos', 7),
(84, 'Miranda', 7),
(85, 'Montalbán', 7),
(86, 'Naguanagua', 7),
(87, 'Puerto Cabello', 7),
(88, 'San Diego', 7),
(89, 'San Joaquín', 7),
(90, 'Valencia', 7),
(91, 'Anzoátegui', 8),
(92, 'Tinaquillo', 8),
(93, 'Girardot', 8),
(94, 'Lima Blanco', 8),
(95, 'Pao de San Juan Baut', 8),
(96, 'Ricaurte', 8),
(97, 'Rómulo Gallegos', 8),
(98, 'San Carlos', 8),
(99, 'Tinaco', 8),
(100, 'Antonio Díaz', 9),
(101, 'Casacoima', 9),
(102, 'Pedernales', 9),
(103, 'Tucupita', 9),
(104, 'Acosta', 10),
(105, 'Bolívar', 10),
(106, 'Buchivacoa', 10),
(107, 'Cacique Manaure', 10),
(108, 'Carirubana', 10),
(109, 'Colina', 10),
(110, 'Dabajuro', 10),
(111, 'Democracia', 10),
(112, 'Falcón', 10),
(113, 'Federación', 10),
(114, 'Jacura', 10),
(115, 'José Laurencio Silva', 10),
(116, 'Los Taques', 10),
(117, 'Mauroa', 10),
(118, 'Miranda', 10),
(119, 'Monseñor Iturriza', 10),
(120, 'Palmasola', 10),
(121, 'Petit', 10),
(122, 'Píritu', 10),
(123, 'San Francisco', 10),
(124, 'Sucre', 10),
(125, 'Tocópero', 10),
(126, 'Unión', 10),
(127, 'Urumaco', 10),
(128, 'Zamora', 10),
(129, 'Camaguán', 11),
(130, 'Chaguaramas', 11),
(131, 'El Socorro', 11),
(132, 'José Félix Ribas', 11),
(133, 'José Tadeo Monagas', 11),
(134, 'Juan Germán Roscio', 11),
(135, 'Julián Mellado', 11),
(136, 'Las Mercedes', 11),
(137, 'Leonardo Infante', 11),
(138, 'Pedro Zaraza', 11),
(139, 'Ortíz', 11),
(140, 'San Gerónimo de Guay', 11),
(141, 'San José de Guaribe', 11),
(142, 'Santa María de Ipire', 11),
(143, 'Sebastián Francisco ', 11),
(144, 'Andrés Eloy Blanco', 12),
(145, 'Crespo', 12),
(146, 'Iribarren', 12),
(147, 'Jiménez', 12),
(148, 'Morán', 12),
(149, 'Palavecino', 12),
(150, 'Simón Planas', 12),
(151, 'Torres', 12),
(152, 'Urdaneta', 12),
(179, 'Alberto Adriani', 13),
(180, 'Andrés Bello', 13),
(181, 'Antonio Pinto Salina', 13),
(182, 'Aricagua', 13),
(183, 'Arzobispo Chacón', 13),
(184, 'Campo Elías', 13),
(185, 'Caracciolo Parra Olm', 13),
(186, 'Cardenal Quintero', 13),
(187, 'Guaraque', 13),
(188, 'Julio César Salas', 13),
(189, 'Justo Briceño', 13),
(190, 'Libertador', 13),
(191, 'Miranda', 13),
(192, 'Obispo Ramos de Lora', 13),
(193, 'Padre Noguera', 13),
(194, 'Pueblo Llano', 13),
(195, 'Rangel', 13),
(196, 'Rivas Dávila', 13),
(197, 'Santos Marquina', 13),
(198, 'Sucre', 13),
(199, 'Tovar', 13),
(200, 'Tulio Febres Cordero', 13),
(201, 'Zea', 13),
(223, 'Acevedo', 14),
(224, 'Andrés Bello', 14),
(225, 'Baruta', 14),
(226, 'Brión', 14),
(227, 'Buroz', 14),
(228, 'Carrizal', 14),
(229, 'Chacao', 14),
(230, 'Cristóbal Rojas', 14),
(231, 'El Hatillo', 14),
(232, 'Guaicaipuro', 14),
(233, 'Independencia', 14),
(234, 'Lander', 14),
(235, 'Los Salias', 14),
(236, 'Páez', 14),
(237, 'Paz Castillo', 14),
(238, 'Pedro Gual', 14),
(239, 'Plaza', 14),
(240, 'Simón Bolívar', 14),
(241, 'Sucre', 14),
(242, 'Urdaneta', 14),
(243, 'Zamora', 14),
(258, 'Acosta', 15),
(259, 'Aguasay', 15),
(260, 'Bolívar', 15),
(261, 'Caripe', 15),
(262, 'Cedeño', 15),
(263, 'Ezequiel Zamora', 15),
(264, 'Libertador', 15),
(265, 'Maturín', 15),
(266, 'Piar', 15),
(267, 'Punceres', 15),
(268, 'Santa Bárbara', 15),
(269, 'Sotillo', 15),
(270, 'Uracoa', 15),
(271, 'Antolín del Campo', 16),
(272, 'Arismendi', 16),
(273, 'García', 16),
(274, 'Gómez', 16),
(275, 'Maneiro', 16),
(276, 'Marcano', 16),
(277, 'Mariño', 16),
(278, 'Península de Macanao', 16),
(279, 'Tubores', 16),
(280, 'Villalba', 16),
(281, 'Díaz', 16),
(282, 'Agua Blanca', 17),
(283, 'Araure', 17),
(284, 'Esteller', 17),
(285, 'Guanare', 17),
(286, 'Guanarito', 17),
(287, 'Monseñor José Vicent', 17),
(288, 'Ospino', 17),
(289, 'Páez', 17),
(290, 'Papelón', 17),
(291, 'San Genaro de Bocono', 17),
(292, 'San Rafael de Onoto', 17),
(293, 'Santa Rosalía', 17),
(294, 'Sucre', 17),
(295, 'Turén', 17),
(296, 'Andrés Eloy Blanco', 18),
(297, 'Andrés Mata', 18),
(298, 'Arismendi', 18),
(299, 'Benítez', 18),
(300, 'Bermúdez', 18),
(301, 'Bolívar', 18),
(302, 'Cajigal', 18),
(303, 'Cruz Salmerón Acosta', 18),
(304, 'Libertador', 18),
(305, 'Mariño', 18),
(306, 'Mejía', 18),
(307, 'Montes', 18),
(308, 'Ribero', 18),
(309, 'Sucre', 18),
(310, 'Valdéz', 18),
(341, 'Andrés Bello', 19),
(342, 'Antonio Rómulo Costa', 19),
(343, 'Ayacucho', 19),
(344, 'Bolívar', 19),
(345, 'Cárdenas', 19),
(346, 'Córdoba', 19),
(347, 'Fernández Feo', 19),
(348, 'Francisco de Miranda', 19),
(349, 'García de Hevia', 19),
(350, 'Guásimos', 19),
(351, 'Independencia', 19),
(352, 'Jáuregui', 19),
(353, 'José María Vargas', 19),
(354, 'Junín', 19),
(355, 'Libertad', 19),
(356, 'Libertador', 19),
(357, 'Lobatera', 19),
(358, 'Michelena', 19),
(359, 'Panamericano', 19),
(360, 'Pedro María Ureña', 19),
(361, 'Rafael Urdaneta', 19),
(362, 'Samuel Darío Maldona', 19),
(363, 'San Cristóbal', 19),
(364, 'Seboruco', 19),
(365, 'Simón Rodríguez', 19),
(366, 'Sucre', 19),
(367, 'Torbes', 19),
(368, 'Uribante', 19),
(369, 'San Judas Tadeo', 19),
(370, 'Andrés Bello', 20),
(371, 'Boconó', 20),
(372, 'Bolívar', 20),
(373, 'Candelaria', 20),
(374, 'Carache', 20),
(375, 'Escuque', 20),
(376, 'José Felipe Márquez ', 20),
(377, 'Juan Vicente Campos ', 20),
(378, 'La Ceiba', 20),
(379, 'Miranda', 20),
(380, 'Monte Carmelo', 20),
(381, 'Motatán', 20),
(382, 'Pampán', 20),
(383, 'Pampanito', 20),
(384, 'Rafael Rangel', 20),
(385, 'San Rafael de Carvaj', 20),
(386, 'Sucre', 20),
(387, 'Trujillo', 20),
(388, 'Urdaneta', 20),
(389, 'Valera', 20),
(390, 'Vargas', 21),
(391, 'Arístides Bastidas', 22),
(392, 'Bolívar', 22),
(407, 'Bruzual', 22),
(408, 'Cocorote', 22),
(409, 'Independencia', 22),
(410, 'José Antonio Páez', 22),
(411, 'La Trinidad', 22),
(412, 'Manuel Monge', 22),
(413, 'Nirgua', 22),
(414, 'Peña', 22),
(415, 'San Felipe', 22),
(416, 'Sucre', 22),
(417, 'Urachiche', 22),
(418, 'José Joaquín Veroes', 22),
(441, 'Almirante Padilla', 23),
(442, 'Baralt', 23),
(443, 'Cabimas', 23),
(444, 'Catatumbo', 23),
(445, 'Colón', 23),
(446, 'Francisco Javier Pul', 23),
(447, 'Páez', 23),
(448, 'Jesús Enrique Losada', 23),
(449, 'Jesús María Semprún', 23),
(450, 'La Cañada de Urdanet', 23),
(451, 'Lagunillas', 23),
(452, 'Machiques de Perijá', 23),
(453, 'Mara', 23),
(454, 'Maracaibo', 23),
(455, 'Miranda', 23),
(456, 'Rosario de Perijá', 23),
(457, 'San Francisco', 23),
(458, 'Santa Rita', 23),
(459, 'Simón Bolívar', 23),
(460, 'Sucre', 23),
(461, 'Valmore Rodríguez', 23),
(462, 'Libertador', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles`
--

CREATE TABLE `niveles` (
  `id_nivel` int(12) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `niveles`
--

INSERT INTO `niveles` (`id_nivel`, `nombre`, `descripcion`) VALUES
(1, 'ADMINISTRADOR ESPECI', 'Director de Tecnología (OTI). Gestión total de usuarios y permisos, configuración, mantenimiento,  seguridad y auditoria de sistema.'),
(2, 'ADMINISTRADOR', 'Directora de la Oficina de Planificación Estratégica. (OPE). Gestión total de usuarios y permisos en su unidad administrativa. Copia de seguridad de la base de datos del (POA).'),
(3, ' ANALISTA', 'Analista de Planificación (OPE). Tiene permisos para realizar tareas administrativas y gestiones especifica en su unidad administrativa pero sin acceso total.'),
(4, 'JEFE DE U.A', 'Monitoreo y supervisión del (POA), aprueba, modifica o elimina el (POA).'),
(5, 'ANALISTA DE U.A', 'Tiene permisos para realizar tareas administrativas y gestiones especifica en su unidad.'),
(6, 'AUDITOR', 'Monitoreo, supervisión, consulta y observaciones sobre el (POA).');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `observaciones`
--

CREATE TABLE `observaciones` (
  `id_observacion` bigint(12) NOT NULL,
  `observacion` varchar(100) NOT NULL,
  `fecha_create` date NOT NULL,
  `fecha_update` date NOT NULL,
  `statu` enum('1','0') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `periodos`
--

CREATE TABLE `periodos` (
  `id_periodo` bigint(12) NOT NULL,
  `id_lineamiento` bigint(12) NOT NULL,
  `rango` varchar(50) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_final` date NOT NULL,
  `statu` enum('1','0') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` bigint(12) NOT NULL,
  `crear` enum('1','2') NOT NULL,
  `editar` enum('1','2') NOT NULL,
  `borrar` enum('1','2') NOT NULL,
  `exportar` enum('1','2') NOT NULL,
  `admin_panel` enum('1','2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id_pregunta` bigint(20) NOT NULL,
  `pregunta1` varchar(20) NOT NULL,
  `repuesta1` varchar(20) NOT NULL,
  `pregunta2` varchar(20) NOT NULL,
  `repuesta2` varchar(20) NOT NULL,
  `pregunta3` varchar(20) NOT NULL,
  `repuesta3` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id_pregunta`, `pregunta1`, `repuesta1`, `pregunta2`, `repuesta2`, `pregunta3`, `repuesta3`) VALUES
(2, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(3, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(4, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(5, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(6, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(7, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(8, 'p1x', 'r1x', 'p2x', 'r2x', 'p3x', 'r3x'),
(9, 'test_upd', 'test', 'test', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` bigint(12) NOT NULL,
  `id_permiso` bigint(12) NOT NULL,
  `id_data` bigint(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguridad`
--

CREATE TABLE `seguridad` (
  `id_seguridad` bigint(12) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `passwrd` varchar(256) NOT NULL,
  `ruta_foto` varchar(100) NOT NULL,
  `cont_fail` int(3) NOT NULL,
  `token` varchar(100) NOT NULL,
  `remember` enum('1','0') NOT NULL,
  `fecha_create` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguridad`
--

INSERT INTO `seguridad` (`id_seguridad`, `usuario`, `passwrd`, `ruta_foto`, `cont_fail`, `token`, `remember`, `fecha_create`, `fecha_update`) VALUES
(2, 'test_upd', 'test', 'test', 0, '', '1', '2025-10-13 22:05:41', '2025-10-13 22:05:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets`
--

CREATE TABLE `tickets` (
  `id_ticket` bigint(12) NOT NULL,
  `id_data` bigint(12) NOT NULL,
  `hora` time NOT NULL,
  `fecha` date NOT NULL,
  `accion` varchar(20) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `statu` enum('1','0') NOT NULL,
  `fecha_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_poa`
--

CREATE TABLE `tipo_poa` (
  `id_tipo_poa` int(12) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `descripcion` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_poa`
--

INSERT INTO `tipo_poa` (`id_tipo_poa`, `nombre`, `descripcion`) VALUES
(1, 'Centralizada ', 'Se concentra en las actividades de carácter permanente y general que son esenciales para el funciona de la organización o institución.'),
(2, 'Proyecto', 'Se centra en la ejecución de acciones específicas y temporales (proyectos) con un inicio y fin definidos y que buscan un resultado o producto único.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id_ubicacion` bigint(12) NOT NULL,
  `id_estado` int(12) NOT NULL,
  `id_municipio` int(12) NOT NULL,
  `estado_sede` varchar(100) NOT NULL,
  `municipio_sede` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id_ubicacion`, `id_estado`, `id_municipio`, `estado_sede`, `municipio_sede`) VALUES
(1, 1, 1, 'estado2', 'municipio2'),
(2, 1, 1, 'estado2', 'municipio2'),
(3, 1, 1, 'estado2', 'municipio2'),
(4, 5, 3, 'estado2', 'municipio2'),
(5, 5, 3, 'estado2', 'municipio2'),
(6, 5, 3, 'estado2', 'municipio2'),
(7, 5, 3, 'estado2', 'municipio2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(12) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellido` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` int(11) NOT NULL,
  `profesion` varchar(20) NOT NULL,
  `statu` enum('1','0','2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `fecha_nacimiento`, `email`, `telefono`, `profesion`, `statu`) VALUES
(1, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', ''),
(2, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', ''),
(3, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', ''),
(4, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', '0'),
(5, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', '0'),
(6, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', '0'),
(7, 'TestUpd', 'User', '2000-01-01', 'testupd@example.com', 0, 'Dev', '0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_data`
--

CREATE TABLE `usuario_data` (
  `id_data` bigint(12) NOT NULL,
  `id_usuario` bigint(12) NOT NULL,
  `id_seguridad` bigint(12) NOT NULL,
  `id_pregunta` bigint(12) NOT NULL,
  `id_departamento` int(12) NOT NULL,
  `id_nivel` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vista_lineamientos`
--

CREATE TABLE `vista_lineamientos` (
  `id_vista` bigint(12) NOT NULL,
  `id_lineamientos` bigint(12) NOT NULL,
  `id_departamento` int(12) NOT NULL,
  `status` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `id_data` (`id_data`);

--
-- Indices de la tabla `cabeceras`
--
ALTER TABLE `cabeceras`
  ADD PRIMARY KEY (`id_cabecera`);

--
-- Indices de la tabla `cabeceras_data`
--
ALTER TABLE `cabeceras_data`
  ADD PRIMARY KEY (`id_cabecera_data`),
  ADD KEY `id_lineamiento` (`id_lineamiento`),
  ADD KEY `id_departamento` (`id_departamento`),
  ADD KEY `id_tipo_poa` (`id_tipo_poa`),
  ADD KEY `id_cabecera` (`id_cabecera`),
  ADD KEY `id_observado` (`id_observado`);

--
-- Indices de la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  ADD PRIMARY KEY (`id_comprobante`);

--
-- Indices de la tabla `comprobantes_data`
--
ALTER TABLE `comprobantes_data`
  ADD PRIMARY KEY (`id_comprobante_data`),
  ADD KEY `id_comprobante` (`id_comprobante`),
  ADD KEY `id_metas` (`id_metas`),
  ADD KEY `id_observado` (`id_observado`);

--
-- Indices de la tabla `comunicatorios`
--
ALTER TABLE `comunicatorios`
  ADD PRIMARY KEY (`id_comunicatorio`),
  ADD KEY `id_lineamiento` (`id_lineamiento`);

--
-- Indices de la tabla `controles`
--
ALTER TABLE `controles`
  ADD PRIMARY KEY (`id_control`),
  ADD KEY `id_comprobante` (`id_comprobante`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `lineamientos`
--
ALTER TABLE `lineamientos`
  ADD PRIMARY KEY (`id_lineamiento`);

--
-- Indices de la tabla `metas_data`
--
ALTER TABLE `metas_data`
  ADD PRIMARY KEY (`id_meta_data`),
  ADD KEY `id_meta` (`id_meta`),
  ADD KEY `id_cabecera_data` (`id_cabecera_data`),
  ADD KEY `id_ubicacion` (`id_ubicacion`),
  ADD KEY `id_observado` (`id_observado`);

--
-- Indices de la tabla `metas_fisicas`
--
ALTER TABLE `metas_fisicas`
  ADD PRIMARY KEY (`id_meta`);

--
-- Indices de la tabla `municipios`
--
ALTER TABLE `municipios`
  ADD PRIMARY KEY (`id_municipio`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `niveles`
--
ALTER TABLE `niveles`
  ADD PRIMARY KEY (`id_nivel`);

--
-- Indices de la tabla `observaciones`
--
ALTER TABLE `observaciones`
  ADD PRIMARY KEY (`id_observacion`);

--
-- Indices de la tabla `periodos`
--
ALTER TABLE `periodos`
  ADD PRIMARY KEY (`id_periodo`),
  ADD KEY `id_lineamiento` (`id_lineamiento`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id_pregunta`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD KEY `id_permiso` (`id_permiso`),
  ADD KEY `id_data` (`id_data`);

--
-- Indices de la tabla `seguridad`
--
ALTER TABLE `seguridad`
  ADD PRIMARY KEY (`id_seguridad`);

--
-- Indices de la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_data` (`id_data`);

--
-- Indices de la tabla `tipo_poa`
--
ALTER TABLE `tipo_poa`
  ADD PRIMARY KEY (`id_tipo_poa`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id_ubicacion`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_municipio` (`id_municipio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `usuario_data`
--
ALTER TABLE `usuario_data`
  ADD PRIMARY KEY (`id_data`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_seguridad` (`id_seguridad`),
  ADD KEY `id_departamento` (`id_departamento`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_nivel` (`id_nivel`);

--
-- Indices de la tabla `vista_lineamientos`
--
ALTER TABLE `vista_lineamientos`
  ADD PRIMARY KEY (`id_vista`),
  ADD KEY `id_lineamientos` (`id_lineamientos`),
  ADD KEY `id_departamento` (`id_departamento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cabeceras`
--
ALTER TABLE `cabeceras`
  MODIFY `id_cabecera` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cabeceras_data`
--
ALTER TABLE `cabeceras_data`
  MODIFY `id_cabecera_data` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comprobantes`
--
ALTER TABLE `comprobantes`
  MODIFY `id_comprobante` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comprobantes_data`
--
ALTER TABLE `comprobantes_data`
  MODIFY `id_comprobante_data` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comunicatorios`
--
ALTER TABLE `comunicatorios`
  MODIFY `id_comunicatorio` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `controles`
--
ALTER TABLE `controles`
  MODIFY `id_control` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estado` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `lineamientos`
--
ALTER TABLE `lineamientos`
  MODIFY `id_lineamiento` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metas_data`
--
ALTER TABLE `metas_data`
  MODIFY `id_meta_data` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `metas_fisicas`
--
ALTER TABLE `metas_fisicas`
  MODIFY `id_meta` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `municipios`
--
ALTER TABLE `municipios`
  MODIFY `id_municipio` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=463;

--
-- AUTO_INCREMENT de la tabla `niveles`
--
ALTER TABLE `niveles`
  MODIFY `id_nivel` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `observaciones`
--
ALTER TABLE `observaciones`
  MODIFY `id_observacion` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `periodos`
--
ALTER TABLE `periodos`
  MODIFY `id_periodo` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id_pregunta` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `seguridad`
--
ALTER TABLE `seguridad`
  MODIFY `id_seguridad` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_ticket` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tipo_poa`
--
ALTER TABLE `tipo_poa`
  MODIFY `id_tipo_poa` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id_ubicacion` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario_data`
--
ALTER TABLE `usuario_data`
  MODIFY `id_data` bigint(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `vista_lineamientos`
--
ALTER TABLE `vista_lineamientos`
  MODIFY `id_vista` bigint(12) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_data`) REFERENCES `usuario_data` (`id_data`);

--
-- Filtros para la tabla `cabeceras_data`
--
ALTER TABLE `cabeceras_data`
  ADD CONSTRAINT `cabeceras_data_ibfk_1` FOREIGN KEY (`id_cabecera`) REFERENCES `cabeceras` (`id_cabecera`),
  ADD CONSTRAINT `cabeceras_data_ibfk_2` FOREIGN KEY (`id_lineamiento`) REFERENCES `lineamientos` (`id_lineamiento`),
  ADD CONSTRAINT `cabeceras_data_ibfk_3` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`),
  ADD CONSTRAINT `cabeceras_data_ibfk_5` FOREIGN KEY (`id_tipo_poa`) REFERENCES `tipo_poa` (`id_tipo_poa`),
  ADD CONSTRAINT `cabeceras_data_ibfk_6` FOREIGN KEY (`id_observado`) REFERENCES `observaciones` (`id_observacion`);

--
-- Filtros para la tabla `comprobantes_data`
--
ALTER TABLE `comprobantes_data`
  ADD CONSTRAINT `comprobantes_data_ibfk_1` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobantes` (`id_comprobante`),
  ADD CONSTRAINT `comprobantes_data_ibfk_2` FOREIGN KEY (`id_metas`) REFERENCES `metas_data` (`id_meta_data`),
  ADD CONSTRAINT `comprobantes_data_ibfk_3` FOREIGN KEY (`id_observado`) REFERENCES `observaciones` (`id_observacion`);

--
-- Filtros para la tabla `comunicatorios`
--
ALTER TABLE `comunicatorios`
  ADD CONSTRAINT `comunicatorios_ibfk_1` FOREIGN KEY (`id_lineamiento`) REFERENCES `lineamientos` (`id_lineamiento`);

--
-- Filtros para la tabla `controles`
--
ALTER TABLE `controles`
  ADD CONSTRAINT `controles_ibfk_1` FOREIGN KEY (`id_comprobante`) REFERENCES `comprobantes_data` (`id_comprobante_data`);

--
-- Filtros para la tabla `metas_data`
--
ALTER TABLE `metas_data`
  ADD CONSTRAINT `metas_data_ibfk_1` FOREIGN KEY (`id_meta`) REFERENCES `metas_fisicas` (`id_meta`),
  ADD CONSTRAINT `metas_data_ibfk_2` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id_ubicacion`),
  ADD CONSTRAINT `metas_data_ibfk_3` FOREIGN KEY (`id_cabecera_data`) REFERENCES `cabeceras_data` (`id_cabecera_data`),
  ADD CONSTRAINT `metas_data_ibfk_4` FOREIGN KEY (`id_observado`) REFERENCES `observaciones` (`id_observacion`);

--
-- Filtros para la tabla `periodos`
--
ALTER TABLE `periodos`
  ADD CONSTRAINT `periodos_ibfk_1` FOREIGN KEY (`id_lineamiento`) REFERENCES `lineamientos` (`id_lineamiento`);

--
-- Filtros para la tabla `roles`
--
ALTER TABLE `roles`
  ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`),
  ADD CONSTRAINT `roles_ibfk_2` FOREIGN KEY (`id_data`) REFERENCES `usuario_data` (`id_data`);

--
-- Filtros para la tabla `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_data`) REFERENCES `usuario_data` (`id_data`);

--
-- Filtros para la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD CONSTRAINT `ubicaciones_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estado`),
  ADD CONSTRAINT `ubicaciones_ibfk_2` FOREIGN KEY (`id_municipio`) REFERENCES `municipios` (`id_municipio`);

--
-- Filtros para la tabla `usuario_data`
--
ALTER TABLE `usuario_data`
  ADD CONSTRAINT `usuario_data_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `usuario_data_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `preguntas` (`id_pregunta`),
  ADD CONSTRAINT `usuario_data_ibfk_3` FOREIGN KEY (`id_seguridad`) REFERENCES `seguridad` (`id_seguridad`),
  ADD CONSTRAINT `usuario_data_ibfk_4` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id_nivel`),
  ADD CONSTRAINT `usuario_data_ibfk_5` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`);

--
-- Filtros para la tabla `vista_lineamientos`
--
ALTER TABLE `vista_lineamientos`
  ADD CONSTRAINT `vista_lineamientos_ibfk_1` FOREIGN KEY (`id_lineamientos`) REFERENCES `lineamientos` (`id_lineamiento`),
  ADD CONSTRAINT `vista_lineamientos_ibfk_2` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
