const userDocument = require('../model/userDocumentModel')

const createDocument = async (req, res, next) => {
  try {
    
  } catch (error) {
    res.status(500).json({ message: 'Unable to Upload Documet', error: error })
  }
}

const updateDocument = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ message: 'Unable to Update Documet', error: error })
  }
}

const viewDocument = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ message: 'Unable to View Documet', error: error })
  }
}

module.exports = { createDocument, updateDocument, viewDocument }
