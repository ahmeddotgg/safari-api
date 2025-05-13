import { Request, Response } from 'express';
import Tour from '../models/tour-model';

export const createTour = async (req: Request, res: Response) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
}

export const getAllTours = async (req: Request, res: Response) => {
    try {
        const tours = await Tour.find()
        res.status(201).json({
            status: 'success',
            items: tours.length,
            data: { tours }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
}

export const getSingleTour = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const tour = await Tour.findById(id)
        res.status(201).json({
            status: 'success',
            data: { tour }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
}

export const updateTour = async (
    { params: { id }, body }: Request, res: Response
) => {
    try {
        const tour = await Tour.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
};

export const deleteTour = async (
    { params: { id } }: Request, res: Response
) => {
    try {
        const tour = await Tour.findByIdAndDelete(id)

        if (!tour) {
            res.status(404).json({
                status: 'fail',
                message: `No tour found with ID ${id}`
            });
            return
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
};