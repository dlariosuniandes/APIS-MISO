--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

-- Started on 2022-09-28 13:36:37 -05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 25273)
-- Name: culture_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.culture_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.culture_entity OWNER TO postgres;

--
-- TOC entry 3418 (class 0 OID 25273)
-- Dependencies: 215
-- Data for Name: culture_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.culture_entity (id, name, description) FROM stdin;
c4da537c-1651-4dae-8486-7db30d67b366	specific	Despite people discussion early. Carry different current interesting dog available guy. Minute hair decide everyone.
\.


--
-- TOC entry 3278 (class 2606 OID 25280)
-- Name: culture_entity PK_a10b36b0e0f19068d94473e0b1f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culture_entity
    ADD CONSTRAINT "PK_a10b36b0e0f19068d94473e0b1f" PRIMARY KEY (id);


-- Completed on 2022-09-28 13:36:37 -05

--
-- PostgreSQL database dump complete
--

