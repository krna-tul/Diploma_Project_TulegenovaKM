from pathlib import Path
import json
import os

EXPERIMENT_DIRECTORY = Path(__file__).resolve().parent
DATA_DIRECTORY = EXPERIMENT_DIRECTORY / "data"
MODEL_EXPORT_PATH = (
    EXPERIMENT_DIRECTORY / "../../prototype/matching/model.json"
).resolve()
TRAINING_CELL_INDICES = (1, 3, 5, 7, 9)


def run_training_notebook():
    notebook_path = DATA_DIRECTORY / "UniSkill_LogisticRegression.ipynb"
    notebook = json.loads(notebook_path.read_text(encoding="utf-8"))
    namespace = {"__name__": "__training_notebook__"}
    previous_directory = Path.cwd()
    try:
        os.chdir(DATA_DIRECTORY)
        for cell_index in TRAINING_CELL_INDICES:
            source = "".join(notebook["cells"][cell_index]["source"])
            compiled_cell = compile(source, f"notebook_cell_{cell_index}", "exec")
            exec(compiled_cell, namespace)
    finally:
        os.chdir(previous_directory)
    return namespace


def serialise_sparse_vector(vector):
    return {
        str(int(index)): float(value)
        for index, value in zip(vector.indices, vector.data)
    }


def build_browser_model(experiment):
    records = experiment["df"]
    pipeline = experiment["model"]
    scaler, classifier = pipeline[0], pipeline[1]
    exported_model = {
        "threshold": float(experiment["threshold"]),
        "mean": scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
        "coef": classifier.coef_[0].tolist(),
        "intercept": float(classifier.intercept_[0]),
        "skills": [],
        "courses": [],
        "metrics": experiment["results"][0],
    }
    unique_skills = records.drop_duplicates(["skill_label", "skill_description"])
    for skill_id, (row_index, record) in enumerate(unique_skills.iterrows()):
        exported_model["skills"].append({
            "id": skill_id,
            "label": record.skill_label,
            "description": record.skill_description,
            "vector": serialise_sparse_vector(experiment["skills"].getrow(row_index)),
        })
    unique_courses = records.drop_duplicates(["course_title", "matched_course_sentence"])
    for course_id, (row_index, record) in enumerate(unique_courses.iterrows()):
        exported_model["courses"].append({
            "id": course_id,
            "title": record.course_title,
            "content": record.matched_course_sentence,
            "titleVector": serialise_sparse_vector(experiment["titles"].getrow(row_index)),
            "contentVector": serialise_sparse_vector(experiment["sentences"].getrow(row_index)),

            "mentor": course_id % 3,
        })
    return exported_model


def build_inference_fixtures(experiment):
    fixtures = []
    for row_index in experiment["test_idx"][:30]:
        record = experiment["df"].iloc[row_index]
        feature_row = experiment["X"][row_index:row_index + 1]
        fixtures.append({
            "skillVector": serialise_sparse_vector(experiment["skills"].getrow(row_index)),
            "titleVector": serialise_sparse_vector(experiment["titles"].getrow(row_index)),
            "contentVector": serialise_sparse_vector(experiment["sentences"].getrow(row_index)),
            "skill": record.skill_label,
            "title": record.course_title,
            "content": record.matched_course_sentence,
            "features": experiment["X"][row_index].tolist(),
            "probability": float(experiment["model"].predict_proba(feature_row)[0, 1]),
        })
    return fixtures


def main():
    import joblib

    experiment = run_training_notebook()
    browser_model = build_browser_model(experiment)
    MODEL_EXPORT_PATH.write_text(
        json.dumps(browser_model, separators=(",", ":")), encoding="utf-8"
    )
    (EXPERIMENT_DIRECTORY / "fixtures.json").write_text(
        json.dumps(build_inference_fixtures(experiment)), encoding="utf-8"
    )
    joblib.dump({
        "vectorizer": experiment["vectorizer"],
        "model": experiment["model"],
        "threshold": experiment["threshold"],
    }, EXPERIMENT_DIRECTORY / "model.joblib")
    print("EXPORTED", len(browser_model["skills"]), len(browser_model["courses"]))


if __name__ == "__main__":
    main()
