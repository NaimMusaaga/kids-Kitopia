-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2026 at 08:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kids_platform`
--

-- --------------------------------------------------------

--
-- Table structure for table `agegroups`
--

CREATE TABLE `agegroups` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `min_age` int(11) NOT NULL,
  `max_age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agegroups`
--

INSERT INTO `agegroups` (`id`, `name`, `min_age`, `max_age`) VALUES
(1, 'Toddlers', 0, 3),
(2, 'Preschool', 4, 6),
(3, 'Kids', 7, 12);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Education'),
(2, 'Music'),
(3, 'Storytime');

-- --------------------------------------------------------

--
-- Table structure for table `stories`
--

CREATE TABLE `stories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `duration` varchar(20) DEFAULT '05:00',
  `author` varchar(100) DEFAULT 'حكواتي القصص',
  `audio_path` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stories`
--

INSERT INTO `stories` (`id`, `title`, `thumbnail_url`, `video_url`, `duration`, `author`, `audio_path`, `file_path`, `content`) VALUES
(1, 'قصة الأرنب والسلحفاة', 'https://img.youtube.com/vi/V8s2M-1n2p0/hqdefault.jpg', 'https://www.youtube.com/watch?v=V8s2M-1n2p0', '05:00', 'حكواتي القصص', 'test.mp3', NULL, NULL),
(2, 'رحلة في عالم البحار', 'https://img.youtube.com/vi/X8H9S-9jM0k/hqdefault.jpg', 'https://www.youtube.com/watch?v=X8H9S-9jM0k', '05:00', 'حكواتي القصص', NULL, NULL, NULL),
(3, 'msw023 01 daelayama alshafii ay 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_01_daelayama_alshafii_ay_64kb.mp3', NULL, NULL),
(4, 'msw023 03 surleau maupassant nad 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_03_surleau_maupassant_nad_64kb.mp3', NULL, NULL),
(5, 'msw023 04 verfeinertebegriffe moeser loa 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_04_verfeinertebegriffe_moeser_loa_64kb.mp3', NULL, NULL),
(6, 'msw023 05 asatana carducci le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_05_asatana_carducci_le_64kb.mp3', NULL, NULL),
(7, 'msw023 06 caffettierefisolofo belli le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_06_caffettierefisolofo_belli_le_64kb.mp3', NULL, NULL),
(8, 'msw023 07 damigellascalot novellino le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_07_damigellascalot_novellino_le_64kb.mp3', NULL, NULL),
(9, 'msw023 08 sifossifoco ceccoangiolieri le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_08_sifossifoco_ceccoangiolieri_le_64kb.mp3', NULL, NULL),
(10, 'msw023 09 carmenquintum catullus le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_09_carmenquintum_catullus_le_64kb.mp3', NULL, NULL),
(11, 'msw023 10 carmenundecimum horatius le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_10_carmenundecimum_horatius_le_64kb.mp3', NULL, NULL),
(12, 'msw023 11 stabatmater jacoponedatodi le 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_11_stabatmater_jacoponedatodi_le_64kb.mp3', NULL, NULL),
(13, 'msw023 12 nosueden lentz ss 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_12_nosueden_lentz_ss_64kb.mp3', NULL, NULL),
(14, 'msw023 13 paweligawel fredro pn81 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_13_paweligawel_fredro_pn81_64kb.mp3', NULL, NULL),
(15, 'msw023 14 sachem sienkiewicz pn81 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_14_sachem_sienkiewicz_pn81_64kb.mp3', NULL, NULL),
(16, 'msw023 15 testament slowacki pn81 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_15_testament_slowacki_pn81_64kb.mp3', NULL, NULL),
(17, 'msw023 16 wladcaczasu lange bw 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_16_wladcaczasu_lange_bw_64kb.mp3', NULL, NULL),
(18, 'msw023 17 wspomnienie sienkiewicz pn81 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_17_wspomnienie_sienkiewicz_pn81_64kb.mp3', NULL, NULL),
(19, 'msw023 18 njenijadi radicevic kz 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_18_njenijadi_radicevic_kz_64kb.mp3', NULL, NULL),
(20, 'msw023 19 curiosidades dario hi 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_19_curiosidades_dario_hi_64kb.mp3', NULL, NULL),
(21, 'msw023 20 segundotrilce vallejo hi 64kb', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'msw023_20_segundotrilce_vallejo_hi_64kb.mp3', NULL, NULL),
(22, 'test', 'https://via.placeholder.com/300', NULL, '05:00', 'حكواتي القصص', 'test.mp3', NULL, NULL),
(23, '123', NULL, NULL, '05:00', 'حكواتي القصص', NULL, 'uploads\\1777984625584.mp3', '123');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `parent_email` varchar(155) NOT NULL,
  `parent_password` varchar(255) DEFAULT NULL,
  `age_group_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `age`, `parent_email`, `parent_password`, `age_group_id`, `created_at`, `username`, `role`) VALUES
(1, 'Naim', 23, '', NULL, NULL, '2026-04-24 20:58:32', '', 'user'),
(2, 'Naim', 0, 'naim@test.com', '$2b$10$qVzdFqx/JVy06dj/HdObVOz.ZsezsMD0wHq2M7RRDDzOZPqKFazGS', NULL, '2026-05-01 14:30:10', 'Naim', 'user'),
(3, 'NAIM mousa', 0, 'naimm2003musa@gmail.com', '$2b$10$WO7bEZ.jGb658Ri2x0HezOI5zrDFomL8sHkSjFHXxxcvT/O6c8HOG', NULL, '2026-05-02 14:41:21', 'NAIM mousa', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `age_group_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `agegroup_id` int(11) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `title`, `url`, `category_id`, `age_group_id`, `created_at`, `agegroup_id`, `thumbnail_url`, `video_url`) VALUES
(2, 'Math for Kids', 'https://video.link/math', 1, 3, '2026-03-26 19:25:18', NULL, 'https://i.ytimg.com/vi/q_wIeX6Bv84/hqdefault.jpg', 'https://www.youtube.com/watch?v=q_wIeX6Bv84'),
(3, 'The Hungry Caterpillar', 'https://video.link/story', 3, 2, '2026-03-26 19:25:18', NULL, 'https://i.ytimg.com/vi/q_wIeX6Bv84/hqdefault.jpg', 'https://www.youtube.com/watch?v=q_wIeX6Bv84'),
(4, 'تجربة فيديو جديد', 'https://youtube.com/test', 1, 1, '2026-05-01 14:40:26', NULL, NULL, NULL),
(6, 'عد الأرقام 1-10', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/R0n9y4Gq5Ew/hqdefault.jpg', 'https://www.youtube.com/watch?v=R0n9y4Gq5Ew'),
(7, 'أصوات الحيوانات في المزرعة', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/6z-8yq21hK4/hqdefault.jpg', 'https://www.youtube.com/watch?v=6z-8yq21hK4'),
(8, 'الأشكال الهندسية الأساسية', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/4m-o1fC0kE4/hqdefault.jpg', 'https://www.youtube.com/watch?v=4m-o1fC0kE4'),
(9, 'الفواكه والخضروات', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/cQYx90i9oYo/hqdefault.jpg', 'https://www.youtube.com/watch?v=cQYx90i9oYo'),
(10, 'أيام الأسبوع بالعربي', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/m-h-S4tT2qg/hqdefault.jpg', 'https://www.youtube.com/watch?v=m-h-S4tT2qg'),
(11, 'الحروف الأبجدية للأطفال', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/5g0v3uY9J1g/hqdefault.jpg', 'https://www.youtube.com/watch?v=5g0v3uY9J1g'),
(12, 'التعرف على الكواكب', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/XqZsoesa55w/hqdefault.jpg', 'https://www.youtube.com/watch?v=XqZsoesa55w'),
(13, 'قصة الأرنب والسلحفاة', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/V8s2M-1n2p0/hqdefault.jpg', 'https://www.youtube.com/watch?v=V8s2M-1n2p0'),
(14, 'رحلة في عالم البحار', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/X8H9S-9jM0k/hqdefault.jpg', 'https://www.youtube.com/watch?v=X8H9S-9jM0k'),
(15, 'التعرف على المهن', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/z0g7K-9M8kL/hqdefault.jpg', 'https://www.youtube.com/watch?v=z0g7K-9M8kL'),
(16, 'كيف نغسل أسناننا؟', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/K9v9J7s8L4k/hqdefault.jpg', 'https://www.youtube.com/watch?v=K9v9J7s8L4k'),
(17, 'أسماء العائلة', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/o5l7K-0P9hG/hqdefault.jpg', 'https://www.youtube.com/watch?v=o5l7K-0P9hG'),
(18, 'التعرف على المواصلات', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/y7h8G-6F5dE/hqdefault.jpg', 'https://www.youtube.com/watch?v=y7h8G-6F5dE'),
(19, 'أغاني الأطفال الممتعة', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/h5g6F-4D3sA/hqdefault.jpg', 'https://www.youtube.com/watch?v=h5g6F-4D3sA'),
(20, 'حكاية قبل النوم', '', NULL, NULL, '2026-05-03 14:00:30', NULL, 'https://img.youtube.com/vi/w2q1A-8S9dF/hqdefault.jpg', 'https://www.youtube.com/watch?v=w2q1A-8S9dF');

-- --------------------------------------------------------

--
-- Table structure for table `watchhistory`
--

CREATE TABLE `watchhistory` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `video_id` int(11) DEFAULT NULL,
  `watched_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agegroups`
--
ALTER TABLE `agegroups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `age_group_id` (`age_group_id`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `age_group_id` (`age_group_id`),
  ADD KEY `fk_category` (`category_id`);

--
-- Indexes for table `watchhistory`
--
ALTER TABLE `watchhistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `video_id` (`video_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agegroups`
--
ALTER TABLE `agegroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `watchhistory`
--
ALTER TABLE `watchhistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`age_group_id`) REFERENCES `agegroups` (`id`);

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`age_group_id`) REFERENCES `agegroups` (`id`);

--
-- Constraints for table `watchhistory`
--
ALTER TABLE `watchhistory`
  ADD CONSTRAINT `watchhistory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watchhistory_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
