# Requirement Sources and Project Parameters

## Register of provided documents

| ID | Document | Use |
| --- | --- | --- |
| TZ | Technical specification for the mentoring platform, version 1.0 (DOCX, Russian) | Target MVP, 15 acceptance criteria, roles and integrations |
| REG | Regulation on Mentoring 2026 (DOCX, Russian) | Appointment procedure, criteria, plan, evaluation, confidentiality |
| DV-RU | Development Visit methodological guidelines (DOCX, Russian) | The three visit stages and the observation map |
| DV-KZ | Development Visit methodological guidelines (DOCX, Kazakh) | Kazakh terminology and the same stages |
| DV-EN | Methodological Guidelines Development Visit EN.docx | English terminology and the same stages |
| STAGE | "By 24 October" stage memo (DOCX, Russian) | List of materials for the first pre-defence |
| USER | Project author's request of 10 October 2026 | Two forms, a showcase, skills, separate commits without push |

The original documents are kept by the project author under their original file names. Appendices 1–4 are mentioned in the regulation, but separate appendix templates were not found in the provided file; the fields below are design schemas that must be agreed with the School.

## Differences and decisions

"Dean" in the verbal request: REG names the School, the School director and the vice-rector for academic affairs. The interface uses the exact role "School Director"; the local equivalence with a dean must be confirmed. A misspelt term for "mentee" in the request is interpreted as "mentee".

The individual plan of a programme participant differs from the Individual Work Plan of a lecturer. The first contains the pair's goals and activities; the second records 15 hours per mentee per trimester unless internal documents state otherwise. The system does not generate the full HR work plan.

The recommendation to meet every two weeks and to choose 2–3 visit focuses is shown as a hint; it is not a hard limit. The limit of two mentees allows an agreed exception. The 10 working day deadline depends on the university calendar and holidays; the prototype counts Monday–Friday only, and the production version must use the approved calendar.

In RU/EN the final reflection is numbered 7, in KZ it is 6. This is a numbering difference, not an extra section. A single semantic schema is used. Localisation of the original workflow prototype into three languages is not complete.

## Questions for the client

1. Who acts as the School director, who registers the order and who checks the training?
2. What are the approved forms of appendices 1–4, the retention periods and the access rules for final documents?
3. Which calendar defines working days and academic periods?
4. How are experience, qualifications, conflict of interest and an exception from the limit confirmed?
5. Who publishes events, and which profile details may be shown within the university?
6. Are RU/KZ/EN needed in the first server version, and which university sign-in is used?

Status: the document analysis is done. The author confirmed a meeting with three client representatives on 8 October 2026; the [key points and slide](research/user-research.md) are saved. The specification contains the clients' requirements and is used together with the meeting results.

## Reconciliation with the specification, 15 October 2026

The specification was added to the project sources. Traceability register: [specification matrix](tz-traceability.md). The regulation defines the business rules, and the specification defines the scope of the digital platform. The recommended stack allows justified equivalents; the chosen Django fits within this boundary. The registrar and the academic department remain details of the consent and training steps from the regulation; the target workspaces include the academic office and the technical administrator with separate permissions.

A three-language RU/KZ/EN interface is mandatory for the target version according to the specification. Target operations take up to 2 s and search up to 3 s under an agreed load. The earlier figures of 100 users, 1,000 profiles and p95 < 1 s are a proposal for a test bench, not an approved client requirement. The calendar, hosting, retention and external integrations need to be agreed. Appendix B of the specification lists F-01–F-11 but does not replace the approved full templates.

## Open data for the model (22 October 2026)

According to the project author, confidential university data was not provided for training or demonstration. The open [UniSkill](https://huggingface.co/datasets/nurlanm/UniSkill_dataset) dataset is used under the Apache-2.0 licence. [Publication by Musazade, Mezei and Zhang (2026)](https://aclanthology.org/2026.lrec-1.31/). The provenance of the CSV files and the hashes of the source files are recorded in `src/research/matching/data/source_manifest.json`. Open course–skill pairs must be distinguished from the illustrative mentor profiles and the illustrative course assignments. More details: [report](frontend-matching-report.md).
