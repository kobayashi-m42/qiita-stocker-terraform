data "aws_iam_policy_document" "codebuild_trust_relationship" {
  "statement" {
    effect = "Allow"

    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "codebuild.amazonaws.com",
        "codedeploy.amazonaws.com",
        "secretsmanager.amazonaws.com",
        "s3.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "codebuild_role" {
  name               = "${terraform.workspace}-codebuild-role"
  assume_role_policy = "${data.aws_iam_policy_document.codebuild_trust_relationship.json}"
}

// TODO 本当は良くないけど適切な権限設定が分からなかったのでAdministratorAccessを付与しておく
// TODO 適切な権限設定が分かった時点で権限を見直す
resource "aws_iam_role_policy_attachment" "attach_admin_access_to_codebuild_role" {
  role       = "${aws_iam_role.codebuild_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_codebuild_project" "api" {
  "artifacts" {
    type = "NO_ARTIFACTS"
  }

  "environment" {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/nodejs:10.14.1"
    type         = "LINUX_CONTAINER"

    environment_variable {
      name  = "DEPLOY_STAGE"
      value = "${terraform.workspace}"
    }
  }

  name         = "${terraform.workspace}-${lookup(var.api, "${terraform.env}.name", var.api["default.name"])}"
  service_role = "${aws_iam_role.codebuild_role.arn}"

  "source" {
    type            = "GITHUB"
    location        = "https://github.com/nekochans/qiita-stocker-backend.git"
    git_clone_depth = 1
  }
}