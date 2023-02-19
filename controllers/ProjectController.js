import ProjectModel from '../models/Project.js';


export const getAll = async (req, res) => {
  try {
    const projects = await ProjectModel.find().populate('user').exec();
    res.json(projects);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to recieve Projects',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const projectId = req.params.id;

    ProjectModel.findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Unable to retvieve project',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'project not found',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to retrieve projects',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const projectId = req.params.id;

    ProjectModel.findOneAndDelete(
      {
        _id: projectId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Failed to retrieve project',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Project not found 404',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to retrieve projects',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new ProjectModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const project = await doc.save();

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create project',
    });
  }
};

export const update = async (req, res) => {
  try {
    const projectId = req.params.id;

    await ProjectModel.updateOne(
      {
        _id: projectId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update project',
    });
  }
};