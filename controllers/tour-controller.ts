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
        const query_object = { ...req.query }
        const special_queries = ['page', 'sort', 'limit', 'fields']
        special_queries.forEach(item => delete query_object[item])

        let query_string = JSON.stringify(query_object)
        query_string = query_string.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        let query = Tour.find(JSON.parse(query_string))

        // special filtering
        const { sort, fields, page, limit } = req.query
        // sorting
        if (sort) {
            const sort_by = typeof sort === 'string'
                ? sort.split(',').join(' ')
                : '';
            query = query.sort(sort_by);
        }
        // fields population
        if (fields) {
            const selected_fields = typeof fields === 'string'
                ? fields.split(',').join(' ')
                : '';
            query = query.select(selected_fields);
        } else {
            query = query.select('-__v -createdAt -updatedAt')
        }
        // pagination
        const page_query = Number(page) || 1
        const limit_query = Number(limit) || 100
        const skip = (page_query - 1) * limit_query
        query = query.skip(skip).limit(limit_query)


        const tours = await query;
        res.status(200).json({
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
        res.status(200).json({
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