import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export const extractResumeText = async (file) => {
  try {
    if (!file) {
      throw new Error('No resume file provided.');
    }

    const mimeType = file.mimetype;

    // PDF
    if (mimeType === 'application/pdf') {
      const parser = new PDFParse({
        data: file.buffer
      });

      const result = await parser.getText();

      await parser.destroy();

      return result.text.trim();
    }

    // DOCX
    if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({
        buffer: file.buffer
      });

      return result.value.trim();
    }

    // DOC
    if (mimeType === 'application/msword') {
      throw new Error(
        'DOC files are not supported for text extraction yet. Please upload a DOCX or PDF resume.'
      );
    }

    throw new Error('Unsupported resume file format.');

  } catch (error) {
    console.error('Resume Text Extraction Error:', error);

    throw new Error(
      error.message || 'Failed to extract resume text.'
    );
  }
};