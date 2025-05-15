import { NextFunction, Request, Response } from 'express';
import Tour from '../models/tour-model';
import { api_features } from '../utils/api_features';



export const getTrendingTours = (req: Request, res: Response, next: NextFunction) => {
    res.locals.query = {
        ...req.query,
        limit: '3',
        sort: '-ratingAverage,price',
        fields: 'name,price,ratingAverage,summary,difficulty'
    };

    console.log('✅ After assignment =>', res.locals.query);
    next();
};

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
        const features = new api_features(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            items: tours.length,
            data: { tours }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
};


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

export const updateTour = async ({ params: { id }, body }: Request, res: Response) => {
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

export const deleteTour = async ({ params: { id } }: Request, res: Response) => {
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

export const getTourStats = async (req: Request, res: Response) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: (error as Error).message
        });
    }
};